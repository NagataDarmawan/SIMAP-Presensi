const pool = require('../config/database');
const { izinCutiQueries, pegawaiQueries, absensiQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const {
  parseHariKerja,
  parseDateOnly,
  formatDateOnly,
  getJakartaDate,
  getWorkDates,
  validateIzinCutiInput,
} = require('../utils/izinCutiHelper');

/**
 * Helper internal: validasi pegawai aktif, jadwal hari kerja, dan kalkulasi tanggal kerja
 */
const resolvePegawaiWorkDates = async (
  executor,
  employeeId,
  startDate,
  endDate,
  { requireActive = true, requireNonEmpty = true } = {}
) => {
  const [pegawaiRows] = await executor.execute(pegawaiQueries.findByIdWithJadwal, [employeeId]);
  if (pegawaiRows.length === 0) {
    const err = new Error('Data pegawai tidak ditemukan.');
    err.status = 404;
    throw err;
  }

  const pegawai = pegawaiRows[0];
  if (requireActive && pegawai.status !== 'AKTIF') {
    throw new Error('Pegawai tidak dalam status AKTIF.');
  }

  const hariKerjaList = parseHariKerja(pegawai.hari_kerja);
  if (hariKerjaList.length === 0) {
    throw new Error('Jadwal kerja pegawai belum diatur atau tidak ditemukan.');
  }

  const datesToProcess = getWorkDates(startDate, endDate, hariKerjaList);
  if (requireNonEmpty && datesToProcess.length === 0) {
    throw new Error('Tidak ada hari kerja pada rentang tanggal yang dipilih.');
  }

  return datesToProcess;
};

/**
 * Helper internal: sinkronisasi record absensi harian dari pengajuan izin/sakit/cuti
 */
const syncAbsensiForDates = async (
  conn,
  pegawaiId,
  dates,
  jenis,
  alasan,
  catatanId,
  excludeCatatanId = null
) => {
  const keterangan = alasan || `Catatan ${jenis}`;

  for (const date of dates) {
    const [absRows] = await conn.execute(absensiQueries.findByPegawaiAndTanggalForUpdate, [
      pegawaiId,
      date,
    ]);

    if (absRows.length > 0) {
      const att = absRows[0];
      if (att.jam_masuk || att.jam_pulang) {
        throw new Error(`Pegawai sudah memiliki riwayat presensi aktual pada tanggal ${date}.`);
      }
      if (att.catatan_izin_cuti_id && Number(att.catatan_izin_cuti_id) !== Number(excludeCatatanId)) {
        throw new Error(`Sudah ada pengajuan lain pada tanggal ${date}.`);
      }
      await conn.execute(absensiQueries.applyIzinCuti, [jenis, keterangan, catatanId, att.id]);
    } else {
      await conn.execute(absensiQueries.insertNonHadir, [
        pegawaiId,
        date,
        jenis,
        catatanId,
        keterangan,
      ]);
    }
  }
};

const getAllIzinCuti = async ({ jenis, pegawai_id } = {}) => {
  const jenisParam = jenis || null;
  const pegawaiIdParam = pegawai_id ? Number(pegawai_id) : null;

  const [rows] = await pool.execute(izinCutiQueries.findAll, [
    jenisParam,
    jenisParam,
    pegawaiIdParam,
    pegawaiIdParam,
  ]);
  return rows;
};

const getIzinCutiById = async (id) => {
  const [rows] = await pool.execute(izinCutiQueries.findById, [id]);
  if (rows.length === 0) {
    const err = new Error('Catatan ketidakhadiran tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const createIzinCuti = async (data, adminId) => {
  const { employeeId, normalizedJenis, startFormatted, endFormatted } = validateIzinCutiInput(data);
  const datesToProcess = await resolvePegawaiWorkDates(
    pool,
    employeeId,
    startFormatted,
    endFormatted
  );

  return withTransaction(async (conn) => {
    const [result] = await conn.execute(izinCutiQueries.insert, [
      employeeId,
      normalizedJenis,
      startFormatted,
      endFormatted,
      data.alasan || null,
      adminId,
    ]);
    const catatanId = result.insertId;

    await syncAbsensiForDates(
      conn,
      employeeId,
      datesToProcess,
      normalizedJenis,
      data.alasan,
      catatanId
    );

    return {
      id: catatanId,
      pegawai_id: employeeId,
      jenis: normalizedJenis,
      tanggal_mulai: startFormatted,
      tanggal_selesai: endFormatted,
      total_hari_kerja: datesToProcess.length,
    };
  });
};

const updateIzinCuti = async (id, data, adminId) => {
  const { employeeId, normalizedJenis, startFormatted, endFormatted } = validateIzinCutiInput(data);

  return withTransaction(async (conn) => {
    const [catatanRows] = await conn.execute(izinCutiQueries.findForUpdate, [id]);
    if (catatanRows.length === 0) {
      const err = new Error('Catatan ketidakhadiran tidak ditemukan.');
      err.status = 404;
      throw err;
    }

    const existing = catatanRows[0];
    if (existing.status !== 'AKTIF' || existing.tanggal_selesai < getJakartaDate()) {
      throw new Error('Hanya pengajuan aktif yang belum melewati tanggal selesai dapat diedit.');
    }

    const datesToProcess = await resolvePegawaiWorkDates(
      conn,
      employeeId,
      startFormatted,
      endFormatted
    );

    if (endFormatted < getJakartaDate()) {
      throw new Error('Tanggal selesai pengajuan aktif tidak boleh sudah terlewati.');
    }

    await conn.execute(izinCutiQueries.updateDetails, [
      employeeId,
      normalizedJenis,
      startFormatted,
      endFormatted,
      data.alasan || null,
      adminId,
      id,
    ]);
    await conn.execute(izinCutiQueries.deleteAbsensiTurunan, [id]);

    await syncAbsensiForDates(
      conn,
      employeeId,
      datesToProcess,
      normalizedJenis,
      data.alasan,
      id,
      id
    );

    return {
      id: Number(id),
      pegawai_id: employeeId,
      jenis: normalizedJenis,
      tanggal_mulai: startFormatted,
      tanggal_selesai: endFormatted,
      total_hari_kerja: datesToProcess.length,
    };
  });
};

const cancelIzinCuti = async (id, adminId) => {
  return withTransaction(async (conn) => {
    const [result] = await conn.execute(izinCutiQueries.updateStatusBatal, [adminId, id]);
    if (result.affectedRows === 0) {
      const [rows] = await conn.execute(izinCutiQueries.findForUpdate, [id]);
      if (rows.length === 0) {
        const err = new Error('Catatan ketidakhadiran tidak ditemukan.');
        err.status = 404;
        throw err;
      }
      throw new Error('Pengajuan yang sudah selesai atau dibatalkan tidak dapat dibatalkan.');
    }

    await conn.execute(izinCutiQueries.deleteAbsensiTurunan, [id]);
    return { id: Number(id), status: 'DIBATALKAN' };
  });
};

const extendIzinCuti = async (id, tanggalSelesai, adminId) => {
  const newEndDate = formatDateOnly(parseDateOnly(tanggalSelesai));

  return withTransaction(async (conn) => {
    const [catatanRows] = await conn.execute(izinCutiQueries.findForUpdate, [id]);
    if (catatanRows.length === 0) {
      const err = new Error('Catatan ketidakhadiran tidak ditemukan.');
      err.status = 404;
      throw err;
    }

    const catatan = catatanRows[0];
    const oldEndDate = String(catatan.tanggal_selesai).slice(0, 10);

    if (catatan.status !== 'AKTIF' || oldEndDate >= getJakartaDate()) {
      throw new Error('Hanya pengajuan yang melewati tanggal selesai yang dapat diperpanjang.');
    }
    if (newEndDate <= oldEndDate) {
      throw new Error('Tanggal perpanjangan harus setelah tanggal selesai saat ini.');
    }

    const nextDay = new Date(parseDateOnly(oldEndDate));
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);

    const datesToProcess = await resolvePegawaiWorkDates(
      conn,
      catatan.pegawai_id,
      formatDateOnly(nextDay),
      newEndDate,
      { requireActive: false, requireNonEmpty: false }
    );

    await syncAbsensiForDates(
      conn,
      catatan.pegawai_id,
      datesToProcess,
      catatan.jenis,
      catatan.alasan,
      id,
      id
    );

    const [updateResult] = await conn.execute(izinCutiQueries.extendEndDate, [
      newEndDate,
      adminId,
      id,
    ]);
    if (updateResult.affectedRows === 0) {
      throw new Error('Pengajuan tidak lagi menunggu konfirmasi dan tidak dapat diperpanjang.');
    }

    return { id: Number(id), tanggal_selesai: newEndDate, status: 'AKTIF' };
  });
};

const completeIzinCuti = async (id, adminId) => {
  const [result] = await pool.execute(izinCutiQueries.updateStatusSelesai, [adminId, id]);
  if (result.affectedRows === 0) {
    const catatan = await getIzinCutiById(id);
    if (catatan.status !== 'MENUNGGU_KONFIRMASI') {
      throw new Error('Hanya pengajuan yang menunggu konfirmasi yang dapat diselesaikan.');
    }
    throw new Error('Pengajuan gagal diselesaikan.');
  }
  return { id: Number(id), status: 'SELESAI' };
};

module.exports = {
  getAllIzinCuti,
  getIzinCutiById,
  createIzinCuti,
  updateIzinCuti,
  cancelIzinCuti,
  extendIzinCuti,
  completeIzinCuti,
};