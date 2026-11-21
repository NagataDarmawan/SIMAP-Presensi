const pool = require('../config/database');
const { qrQueries, pegawaiQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const { generateQrPayload } = require('../utils/qrHelper');

const getActivePegawaiForQr = async (conn, pegawaiId) => {
  const [pegawaiRows] = await conn.execute(pegawaiQueries.findById, [pegawaiId]);
  if (pegawaiRows.length === 0) {
    const err = new Error('Data pegawai tidak ditemukan.');
    err.status = 404;
    throw err;
  }

  const pegawai = pegawaiRows[0];
  if (pegawai.status !== 'AKTIF') {
    throw new Error('QR Code tidak dapat diproses untuk pegawai berstatus NONAKTIF.');
  }

  return pegawai;
};

const getAllQR = async () => {
  const [rows] = await pool.execute(qrQueries.findAll);
  return rows;
};

const getQRByPegawaiId = async (pegawaiId) => {
  const [rows] = await pool.execute(qrQueries.findByPegawaiId, [pegawaiId]);
  if (rows.length === 0) {
    const err = new Error('QR Code untuk pegawai ini belum dibuat.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const generateQR = async (pegawaiId) => {
  return withTransaction(async (conn) => {
    const pegawai = await getActivePegawaiForQr(conn, pegawaiId);

    const [existingQR] = await conn.execute(qrQueries.findByPegawaiId, [pegawaiId]);
    if (existingQR.length > 0) {
      throw new Error('Pegawai sudah memiliki QR Code. Gunakan fitur Regenerate untuk memperbarui.');
    }

    const { tokenHash, response } = await generateQrPayload(pegawai);
    await conn.execute(qrQueries.insert, [pegawaiId, tokenHash]);

    return response;
  });
};

const regenerateQR = async (pegawaiId) => {
  return withTransaction(async (conn) => {
    const pegawai = await getActivePegawaiForQr(conn, pegawaiId);

    const { tokenHash, response } = await generateQrPayload(pegawai);
    const [result] = await conn.execute(qrQueries.updateTokenHash, [tokenHash, pegawaiId]);

    if (result.affectedRows === 0) {
      await conn.execute(qrQueries.insert, [pegawaiId, tokenHash]);
    }

    return response;
  });
};

module.exports = {
  getAllQR,
  getQRByPegawaiId,
  generateQR,
  regenerateQR,
};