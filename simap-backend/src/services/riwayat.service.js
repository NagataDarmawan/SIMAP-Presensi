const pool = require('../config/database');
const { riwayatAbsensiQueries } = require('../database/queries');

const getRiwayatAbsensi = async (startDate, endDate, status = null, search = null) => {
  if (!startDate || !endDate) {
    const err = new Error('Parameter startDate dan endDate wajib diisi.');
    err.status = 400;
    throw err;
  }

  if (startDate > endDate) {
    const err = new Error('Tanggal mulai (startDate) tidak boleh melebihi tanggal akhir (endDate).');
    err.status = 400;
    throw err;
  }

  const statusParam = status || null;
  const searchParam = typeof search === 'string' && search.trim() ? search.trim() : null;

  const [rows] = await pool.execute(riwayatAbsensiQueries.getRiwayatAbsensi, [
    startDate,
    endDate,
    statusParam,
    statusParam,
    searchParam,
    searchParam,
    searchParam,
  ]);
  return rows || [];
};

const getRiwayatAbsensiById = async (id) => {
  const [rows] = await pool.execute(riwayatAbsensiQueries.getRiwayatAbsensiById, [id]);
  if (rows.length === 0) {
    const err = new Error('Data riwayat presensi tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

module.exports = {
  getRiwayatAbsensi,
  getRiwayatAbsensiById,
};