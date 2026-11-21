const pool = require('../config/database');
const { jadwalQueries } = require('../database/queries');

const validateAndNormalizeJadwal = (data) => {
  const { nama_jadwal, hari_kerja, jam_masuk, jam_pulang, toleransi_terlambat } = data;
  const cleanNama = typeof nama_jadwal === 'string' ? nama_jadwal.trim() : '';

  if (!cleanNama || !hari_kerja || !jam_masuk || !jam_pulang) {
    throw new Error('Nama jadwal, hari kerja, jam masuk, dan jam pulang wajib diisi.');
  }

  const formattedHariKerja = Array.isArray(hari_kerja)
    ? hari_kerja.join(',')
    : String(hari_kerja).trim();

  if (!formattedHariKerja) {
    throw new Error('Minimal pilih satu hari kerja.');
  }

  const toleransi =
    toleransi_terlambat !== undefined && toleransi_terlambat !== ''
      ? Number(toleransi_terlambat)
      : 0;

  if (Number.isNaN(toleransi) || toleransi < 0) {
    throw new Error('Toleransi keterlambatan harus berupa angka 0 atau lebih.');
  }

  return {
    nama_jadwal: cleanNama,
    hari_kerja: formattedHariKerja,
    jam_masuk,
    jam_pulang,
    toleransi_terlambat: toleransi,
  };
};

// 1. Ambil Semua Jadwal Kerja
const getAllJadwal = async () => {
  const [rows] = await pool.execute(jadwalQueries.findAll);
  return rows;
};

// 2. Ambil Detail Jadwal Kerja Berdasarkan ID
const getJadwalById = async (id) => {
  const [rows] = await pool.execute(jadwalQueries.findById, [id]);
  if (rows.length === 0) {
    const err = new Error('Jadwal kerja tidak ditemukan.');
    err.status = 404;
    throw err;
  }
  return rows[0];
};

// 3. Tambah Jadwal Kerja Baru
const createJadwal = async (data) => {
  const payload = validateAndNormalizeJadwal(data);

  const [result] = await pool.execute(jadwalQueries.insert, [
    payload.nama_jadwal,
    payload.hari_kerja,
    payload.jam_masuk,
    payload.jam_pulang,
    payload.toleransi_terlambat,
  ]);

  return { id: result.insertId, ...data, ...payload };
};

// 4. Ubah Data Jadwal Kerja
const updateJadwal = async (id, data) => {
  await getJadwalById(id);
  const payload = validateAndNormalizeJadwal(data);

  await pool.execute(jadwalQueries.update, [
    payload.nama_jadwal,
    payload.hari_kerja,
    payload.jam_masuk,
    payload.jam_pulang,
    payload.toleransi_terlambat,
    id,
  ]);

  return { id: Number(id), ...data, ...payload };
};

// 5. Hapus Jadwal Kerja (Hanya yang belum digunakan oleh pegawai)
const deleteJadwal = async (id) => {
  await getJadwalById(id);

  const [checkRows] = await pool.execute(jadwalQueries.checkUsageInPegawai, [id]);
  if (checkRows[0].total > 0) {
    throw new Error('Jadwal kerja tidak dapat dihapus karena sedang digunakan oleh pegawai.');
  }

  await pool.execute(jadwalQueries.delete, [id]);
  return true;
};

module.exports = {
  getAllJadwal,
  getJadwalById,
  createJadwal,
  updateJadwal,
  deleteJadwal,
};