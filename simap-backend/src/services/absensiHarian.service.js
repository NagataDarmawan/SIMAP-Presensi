const pool = require('../config/database');
const { absensiQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const { formatDateOnly, parseDateOnly } = require('../utils/izinCutiHelper');
const {
  DEFAULT_JADWAL_PULANG,
  getWibDateTime,
  parseTimeToSeconds,
  isScheduledOnDate,
  buildManualEntryPayload,
} = require('../utils/absensiHelper');

const getHarianAbsensi = async ({ tanggal, search } = {}) => {
  const targetDate = tanggal ? formatDateOnly(parseDateOnly(tanggal)) : getWibDateTime().tanggal;
  const { tanggal: todayWib, jam: nowWib } = getWibDateTime();
  const nowSeconds = parseTimeToSeconds(nowWib);

  const [rows] = await pool.execute(absensiQueries.findHarianPegawaiByTanggal, [targetDate]);
  const scheduledRows = rows.filter((row) => isScheduledOnDate(row.hari_kerja, targetDate));

  const mapped = scheduledRows.map((row) => {
    const sudahPresensi = Boolean(row.absensi_id);
    const jamPulangJadwal = row.jam_pulang_jadwal || DEFAULT_JADWAL_PULANG;
    const lewatBatasPulang =
      !sudahPresensi &&
      (targetDate < todayWib ||
        (targetDate === todayWib && nowSeconds > parseTimeToSeconds(jamPulangJadwal)));

    return {
      pegawai_id: row.pegawai_id,
      kode_pegawai: row.kode_pegawai,
      nama: row.nama,
      jabatan: row.jabatan,
      nama_jadwal: row.nama_jadwal,
      hari_kerja: row.hari_kerja,
      jam_masuk_jadwal: row.jam_masuk_jadwal,
      jam_pulang_jadwal: row.jam_pulang_jadwal,
      toleransi_terlambat: Number(row.toleransi_terlambat) || 0,
      absensi_id: row.absensi_id || null,
      tanggal: targetDate,
      sudah_presensi: sudahPresensi,
      lewat_batas_pulang: lewatBatasPulang,
      status: sudahPresensi ? row.status : 'BELUM_PRESENSI',
      jam_masuk: row.jam_masuk || null,
      jam_pulang: row.jam_pulang || null,
      menit_terlambat: Number(row.menit_terlambat) || 0,
      keterangan: row.keterangan || null,
      catatan_izin_cuti_id: row.catatan_izin_cuti_id || null,
    };
  });

  const keyword = typeof search === 'string' && search.trim() ? search.trim().toLowerCase() : '';
  const items = keyword
    ? mapped.filter(
        (item) =>
          item.nama.toLowerCase().includes(keyword) ||
          item.kode_pegawai.toLowerCase().includes(keyword) ||
          (item.jabatan && item.jabatan.toLowerCase().includes(keyword))
      )
    : mapped;

  const sudahCount = mapped.filter((item) => item.sudah_presensi).length;
  const belumCount = mapped.length - sudahCount;
  const lewatBatasCount = mapped.filter((item) => item.lewat_batas_pulang).length;

  return {
    tanggal: targetDate,
    summary: {
      total_terjadwal: mapped.length,
      sudah_presensi: sudahCount,
      belum_presensi: belumCount,
      lewat_batas_pulang: lewatBatasCount,
    },
    items,
  };
};

const createManualAbsensi = async (data) => {
  const pegawaiId = Number(data?.pegawai_id);
  if (!Number.isInteger(pegawaiId) || pegawaiId <= 0) {
    throw new Error('Pegawai wajib dipilih.');
  }

  const targetDate = data?.tanggal
    ? formatDateOnly(parseDateOnly(data.tanggal))
    : getWibDateTime().tanggal;

  return withTransaction(async (conn) => {
    const [pegawaiRows] = await conn.execute(absensiQueries.findPegawaiWithJadwalById, [pegawaiId]);
    if (pegawaiRows.length === 0) {
      const err = new Error('Data pegawai tidak ditemukan.');
      err.status = 404;
      throw err;
    }

    const pegawai = pegawaiRows[0];
    if (pegawai.status !== 'AKTIF') {
      throw new Error('Pegawai berstatus NONAKTIF tidak dapat diinput presensinya.');
    }

    if (!isScheduledOnDate(pegawai.hari_kerja, targetDate)) {
      throw new Error(`Tanggal ${targetDate} bukan hari kerja terjadwal untuk pegawai '${pegawai.nama}'.`);
    }

    const [existingRows] = await conn.execute(absensiQueries.findByPegawaiAndTanggalForUpdate, [
      pegawaiId,
      targetDate,
    ]);
    if (existingRows.length > 0) {
      throw new Error(
        `Pegawai '${pegawai.nama}' sudah memiliki catatan presensi (${existingRows[0].status}) pada tanggal ${targetDate}. Gunakan fitur koreksi jika ingin mengubah.`
      );
    }

    const payload = buildManualEntryPayload(pegawai, data);

    const [insertRes] = await conn.execute(absensiQueries.insertManual, [
      pegawaiId,
      targetDate,
      payload.jam_masuk,
      payload.jam_pulang,
      payload.status,
      payload.keterangan,
      payload.menit_terlambat,
    ]);

    return {
      id: insertRes.insertId,
      pegawai_id: pegawaiId,
      nama: pegawai.nama,
      kode_pegawai: pegawai.kode_pegawai,
      tanggal: targetDate,
      ...payload,
    };
  });
};

const markAutoAlpha = async ({ tanggal, force = false } = {}) => {
  const targetDate = tanggal ? formatDateOnly(parseDateOnly(tanggal)) : getWibDateTime().tanggal;
  const { tanggal: todayWib, jam: nowWib } = getWibDateTime();

  if (targetDate > todayWib) {
    throw new Error('Tidak dapat menetapkan ALPHA untuk tanggal yang belum terjadi.');
  }

  const nowSeconds = parseTimeToSeconds(nowWib);

  return withTransaction(async (conn) => {
    const [rows] = await conn.execute(absensiQueries.findHarianPegawaiByTanggal, [targetDate]);
    const candidates = rows.filter((row) => {
      if (row.absensi_id) return false;
      if (!isScheduledOnDate(row.hari_kerja, targetDate)) return false;
      if (force || targetDate < todayWib) return true;
      const jamPulangJadwal = row.jam_pulang_jadwal || DEFAULT_JADWAL_PULANG;
      return nowSeconds > parseTimeToSeconds(jamPulangJadwal);
    });

    let insertedCount = 0;
    const keterangan = force
      ? 'Tanpa keterangan (Ditetapkan ALPHA oleh Admin)'
      : 'Tanpa keterangan melewati batas jam kerja (Otomatis sistem)';

    for (const emp of candidates) {
      const [lockRows] = await conn.execute(absensiQueries.findByPegawaiAndTanggalForUpdate, [
        emp.pegawai_id,
        targetDate,
      ]);
      if (lockRows.length === 0) {
        await conn.execute(absensiQueries.insertNonHadir, [
          emp.pegawai_id,
          targetDate,
          'ALPHA',
          null,
          keterangan,
        ]);
        insertedCount += 1;
      }
    }

    return {
      tanggal: targetDate,
      total_ditandai_alpha: insertedCount,
    };
  });
};

module.exports = {
  getHarianAbsensi,
  createManualAbsensi,
  markAutoAlpha,
};