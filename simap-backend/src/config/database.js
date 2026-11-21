const mysql = require('mysql2/promise');
require('dotenv').config();

// Membuat connection pool MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'simap_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Wajib setting zona waktu Asia/Jakarta (WIB) sesuai PRD SIMAP
  timezone: '+07:00',
  dateStrings: true
});

// Fungsi helper untuk menguji koneksi database
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi ke database MySQL (SIMAP) berhasil!');
    connection.release();
  } catch (error) {
    console.error('❌ Gagal terhubung ke database MySQL:', error.message);
  }
};

testConnection();

module.exports = pool;