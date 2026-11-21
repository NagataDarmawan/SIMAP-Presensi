const pool = require('../config/database');
const { absensiQueries, pegawaiQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const {
  NON_HADIR_STATUSES,
  getWibDateTime,
  evaluateMasukStatus,
  evaluatePulangStatus,
  validateJedaPulang,
  buildCorrectionPayload,
} = require('../utils/absensiHelper');

const buildBaseScanResponse = (pegawai, jenis, tanggal) => ({
  pegawai: pegawai.nama,
  kode_pegawai: pegawai.kode_pegawai,
  jabatan: pegawai.jabatan,
  jenis,
  tanggal,
});

const processAbsensiMasuk = async (conn, pegawai, existing, tanggal, jam) => {
  if (existing?.jam_masuk) {
    throw new Error(
      `Pegawai '${pegawai.nama}' sudah melakukan presensi masuk hari ini pada pukul ${existing.jam_masuk}.`
    );
  }

  const evalMasuk = evaluateMasukStatus(jam, pegawai.jam_masuk, pegawai.toleransi_terlambat);

  try {
    if (existing) {
      await conn.execute(absensiQueries.correction, [
        jam,
        existing.jam_pulang,
        evalMasuk.status,
        evalMasuk.keterangan,
        evalMasuk.menit_terlambat,
        existing.id,
      ]);
    } else {
      await conn.execute(absensiQueries.insertMasuk, [
        pegawai.id,
        tanggal,
        jam,
        evalMasuk.status,
        evalMasuk.keterangan,
        evalMasuk.menit_terlambat,
      ]);
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error(`Pegawai '${pegawai.nama}' sudah tercatat presensi masuk pada tanggal ${tanggal}.`);
    }
    throw err;
  }

  return {
    ...buildBaseScanResponse(pegawai, 'ABSEN MASUK', tanggal),
    jam_masuk: jam,
    jam_pulang: null,
    ...evalMasuk,
  };
};

const processAbsensiPulang = async (conn, pegawai, existing, tanggal, jam) => {
  if (!existing?.jam_masuk) {
    throw new Error(`Pegawai '${pegawai.nama}' belum melakukan presensi masuk hari ini.`);
  }
  if (existing.jam_pulang) {
    throw new Error(
      `Pegawai '${pegawai.nama}' sudah melakukan presensi pulang hari ini pada pukul ${existing.jam_pulang}.`
    );
  }

  validateJedaPulang(existing.jam_masuk, jam);

  const evalPulang = evaluatePulangStatus(jam, pegawai.jam_pulang);
  const keterangan = existing.keterangan
    ? `${existing.keterangan} | ${evalPulang.keterangan}`
    : evalPulang.keterangan;

  const [res] = await conn.execute(absensiQueries.updatePulangWithKeterangan, [
    jam,
    keterangan,
    existing.id,
  ]);
  if (res.affectedRows === 0) {
    throw new Error(`Pegawai '${pegawai.nama}' sudah melakukan presensi pulang hari ini.`);
  }

  return {
    ...buildBaseScanResponse(pegawai, 'ABSEN PULANG', tanggal),
    jam_masuk: existing.jam_masuk,
    jam_pulang: jam,
    status: existing.status,
    menit_terlambat: Number(existing.menit_terlambat) || 0,
    status_pulang: evalPulang.status_pulang,
    menit_pulang_cepat: evalPulang.menit_pulang_cepat,
    keterangan,
  };
};

const processScanAbsensi = async (rawToken, jenisAbsensi) => {
  const cleanToken = typeof rawToken === 'string' ? rawToken.trim() : '';
  if (!cleanToken || !jenisAbsensi) {
    throw new Error('Token QR Code dan jenis presensi (MASUK/PULANG) wajib diisi.');
  }

  const jenis = String(jenisAbsensi).trim().toUpperCase();
  if (!['MASUK', 'PULANG'].includes(jenis)) {
    throw new Error("Jenis presensi harus 'MASUK' atau 'PULANG'.");
  }

  return withTransaction(async (conn) => {
    const [pegawaiRows] = await conn.execute(pegawaiQueries.findByKodeQr, [cleanToken]);
    if (pegawaiRows.length === 0) {
      throw new Error('QR Code ID Card tidak terdaftar.');
    }

    const pegawai = pegawaiRows[0];
    if (pegawai.status !== 'AKTIF') {
      throw new Error('Pegawai berstatus NONAKTIF tidak dapat melakukan presensi.');
    }

    const { tanggal, jam } = getWibDateTime();
    const [absensiRows] = await conn.execute(absensiQueries.findByPegawaiAndTanggalForUpdate, [
      pegawai.id,
      tanggal,
    ]);
    const existing = absensiRows[0] || null;

    if (existing && NON_HADIR_STATUSES.includes(existing.status)) {
      throw new Error(`Pegawai memiliki catatan ${existing.status} pada tanggal ini.`);
    }

    return jenis === 'MASUK'
      ? processAbsensiMasuk(conn, pegawai, existing, tanggal, jam)
      : processAbsensiPulang(conn, pegawai, existing, tanggal, jam);
  });
};

const getHistoryAbsensi = async ({ tanggal, status, search } = {}) => {
  const searchParam = search ? `%${search}%` : null;
  const [rows] = await pool.execute(absensiQueries.findAllHistory, [
    tanggal || null,
    tanggal || null,
    status || null,
    status || null,
    searchParam,
    searchParam,
    searchParam,
  ]);
  return rows;
};

const getAbsensiById = async (id) => {
  const [rows] = await pool.execute(absensiQueries.findById, [id]);
  if (rows.length === 0) {
    const err = new Error('Data presensi tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const correctAbsensi = async (id, data) => {
  if (!data?.status) {
    throw new Error('Status presensi wajib diisi.');
  }

  return withTransaction(async (conn) => {
    const [rows] = await conn.execute(absensiQueries.findById, [id]);
    if (rows.length === 0) {
      const err = new Error('Data presensi tidak ditemukan.');
      err.status = 404;
      throw err;
    }

    const [jadwalRows] = await conn.execute(absensiQueries.findJadwalByAbsensiId, [id]);
    const payload = buildCorrectionPayload(rows[0], jadwalRows[0] || {}, data);

    await conn.execute(absensiQueries.correction, [
      payload.jam_masuk,
      payload.jam_pulang,
      payload.status,
      payload.keterangan,
      payload.menit_terlambat,
      id,
    ]);

    return { id: Number(id), ...payload };
  });
};

module.exports = {
  processScanAbsensi,
  getHistoryAbsensi,
  getAbsensiById,
  correctAbsensi,
};