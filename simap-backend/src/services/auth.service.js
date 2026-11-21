const bcrypt = require('bcrypt');
const pool = require('../config/database');
const { authQueries } = require('../database/queries');

const SALT_ROUNDS = 10;

const loginAdmin = async (username, password) => {
  const cleanUsername = typeof username === 'string' ? username.trim() : '';
  if (!cleanUsername || !password) {
    throw new Error('Username dan password wajib diisi.');
  }

  const [rows] = await pool.execute(authQueries.findUserByUsername, [cleanUsername]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Username atau password salah.');
  }

  return {
    id: user.id,
    username: user.username,
    nama_lengkap: user.nama_lengkap,
    created_at: user.created_at,
  };
};

const registerAdmin = async (username, password, nama_lengkap) => {
  const cleanUsername = typeof username === 'string' ? username.trim() : '';
  const cleanNama = typeof nama_lengkap === 'string' ? nama_lengkap.trim() : '';

  if (!cleanUsername || !password || !cleanNama) {
    throw new Error('Username, password, dan nama lengkap wajib diisi.');
  }
  if (password.length < 6) {
    throw new Error('Password minimal 6 karakter.');
  }

  const [existing] = await pool.execute(authQueries.findUserByUsername, [cleanUsername]);
  if (existing.length > 0) {
    throw new Error(`Username '${cleanUsername}' sudah digunakan.`);
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const [result] = await pool.execute(authQueries.createUser, [
    cleanUsername,
    hashedPassword,
    cleanNama,
  ]);

  return {
    id: result.insertId,
    username: cleanUsername,
    nama_lengkap: cleanNama,
  };
};

const resetPassword = async (username, newPassword) => {
  const cleanUsername = typeof username === 'string' ? username.trim() : '';

  if (!cleanUsername || !newPassword) {
    throw new Error('Username dan password baru wajib diisi.');
  }
  if (newPassword.length < 6) {
    throw new Error('Password baru minimal 6 karakter.');
  }

  const [rows] = await pool.execute(authQueries.findUserByUsername, [cleanUsername]);
  if (rows.length === 0) {
    throw new Error('Pengguna dengan username tersebut tidak ditemukan.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await pool.execute(authQueries.updatePassword, [hashedPassword, rows[0].id]);

  return true;
};

module.exports = {
  loginAdmin,
  registerAdmin,
  resetPassword,
};