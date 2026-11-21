const pool = require('../config/database');
const { pegawaiQueries, jadwalQueries } = require('../database/queries');
const { withTransaction } = require('../utils/dbTransaction');
const {
  normalizeJenisKelamin,
  generateRandomKodePegawai,
} = require('../utils/pegawaiHelper');

const generateUniqueKodePegawai = async (conn) => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = generateRandomKodePegawai();
    const [existing] = await conn.execute(pegawaiQueries.findByKode, [candidate]);
    if (existing.length === 0) return candidate;
  }
  throw new Error('Gagal membuat kode pegawai unik. Silakan coba lagi.');
};

const validateAndNormalizePegawai = (data) => {
  const { nama, jenis_kelamin, alamat, no_telepon, jabatan, tanggal_masuk, jadwal_kerja_id } = data;
  const cleanNama = typeof nama === 'string' ? nama.trim() : '';

  if (!cleanNama || !jenis_kelamin || !tanggal_masuk || !jadwal_kerja_id) {
    throw new Error('Nama, jenis kelamin, tanggal masuk, dan jadwal kerja wajib diisi.');
  }

  return {
    nama: cleanNama,
    jenis_kelamin: normalizeJenisKelamin(jenis_kelamin),
    alamat: alamat || null,
    no_telepon: no_telepon || null,
    jabatan: jabatan || null,
    tanggal_masuk,
    jadwal_kerja_id,
  };
};

const getAllPegawai = async ({ status, search } = {}) => {
  const statusParam = status || null;
  const searchParam = search ? `%${search}%` : null;

  const [rows] = await pool.execute(pegawaiQueries.findAll, [
    statusParam,
    statusParam,
    searchParam,
    searchParam,
    searchParam,
    searchParam,
  ]);
  return rows;
};

const getPegawaiById = async (id) => {
  const [rows] = await pool.execute(pegawaiQueries.findById, [id]);
  if (rows.length === 0) {
    const err = new Error('Data pegawai tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

const createPegawai = async (data) => {
  const payload = validateAndNormalizePegawai(data);

  return withTransaction(async (conn) => {
    const [existingJadwal] = await conn.execute(jadwalQueries.findById, [payload.jadwal_kerja_id]);
    if (existingJadwal.length === 0) {
      throw new Error('Jadwal kerja yang dipilih tidak valid.');
    }

    const kode_pegawai = await generateUniqueKodePegawai(conn);
    const kode_qr = kode_pegawai;

    const [result] = await conn.execute(pegawaiQueries.insert, [
      kode_pegawai,
      kode_qr,
      payload.nama,
      payload.jenis_kelamin,
      payload.alamat,
      payload.no_telepon,
      payload.jabatan,
      payload.tanggal_masuk,
      payload.jadwal_kerja_id,
    ]);

    return {
      id: result.insertId,
      ...data,
      ...payload,
      kode_pegawai,
      kode_qr,
      status: 'AKTIF',
    };
  });
};

const updatePegawai = async (id, data) => {
  await getPegawaiById(id);
  const payload = validateAndNormalizePegawai(data);

  const [existingJadwal] = await pool.execute(jadwalQueries.findById, [payload.jadwal_kerja_id]);
  if (existingJadwal.length === 0) {
    throw new Error('Jadwal kerja yang dipilih tidak valid.');
  }

  await pool.execute(pegawaiQueries.update, [
    payload.nama,
    payload.jenis_kelamin,
    payload.alamat,
    payload.no_telepon,
    payload.jabatan,
    payload.tanggal_masuk,
    payload.jadwal_kerja_id,
    id,
  ]);

  return { id: Number(id), ...data, ...payload };
};

const updateStatusPegawai = async (id, status) => {
  await getPegawaiById(id);
  if (!['AKTIF', 'NONAKTIF'].includes(status)) {
    throw new Error("Status pegawai harus 'AKTIF' atau 'NONAKTIF'.");
  }

  await pool.execute(pegawaiQueries.updateStatus, [status, id]);
  return { id: Number(id), status };
};

const deletePegawai = async (id) => {
  const pegawai = await getPegawaiById(id);

  return withTransaction(async (conn) => {
    await conn.execute(pegawaiQueries.deleteAbsensiByPegawaiId, [id]);
    await conn.execute(pegawaiQueries.delete, [id]);
    return { id: Number(id), nama: pegawai.nama };
  });
};

module.exports = {
  getAllPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  updateStatusPegawai,
  deletePegawai,
};