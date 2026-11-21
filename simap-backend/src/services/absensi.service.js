const pool = require('../config/database');
const { absensiQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const { IZIN_CUTI_STATUSES, buildCorrectionPayload } = require('../utils/absensiHelper');
const { processScanAbsensi } = require('./absensiScan.service');
const {
  getHarianAbsensi,
  createManualAbsensi,
  markAutoAlpha,
} = require('./absensiHarian.service');

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

    const existing = rows[0];
    if (existing.catatan_izin_cuti_id || IZIN_CUTI_STATUSES.includes(existing.status)) {
      throw new Error(
        `Catatan ${existing.status} ini terhubung dengan modul Izin & Cuti. Silakan ubah atau batalkan melalui menu Izin & Cuti.`
      );
    }

    const [jadwalRows] = await conn.execute(absensiQueries.findJadwalByAbsensiId, [id]);
    const payload = buildCorrectionPayload(existing, jadwalRows[0] || {}, data);

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
  getHarianAbsensi,
  createManualAbsensi,
  markAutoAlpha,
  getHistoryAbsensi,
  getAbsensiById,
  correctAbsensi,
};