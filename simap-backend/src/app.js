const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const pool = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const jadwalRoutes = require('./routes/jadwal.routes');
const pegawaiRoutes = require('./routes/pegawai.routes');
const qrRoutes = require('./routes/qr.routes');
const absensiRoutes = require('./routes/absensi.routes');
const izinCutiRoutes = require('./routes/izin-cuti.routes');
const rekapRoutes = require('./routes/rekap.routes');
const monitoringRoutes = require('./routes/monitoring.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const riwayatRoutes = require('./routes/riwayat.routes');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Trust Proxy (wajib saat Next.js rewrites/reverse proxy aktif)
app.set('trust proxy', 1);

// 2. Konfigurasi CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// 3. Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Inisialisasi MySQL Session Store
const sessionStore = new MySQLStore(
  {
    expiration: 86400000, // 24 jam
    checkExpirationInterval: 900000, // Pembersihan otomatis per 15 menit
    clearExpired: true,
    createDatabaseTable: false,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data',
      },
    },
  },
  pool
);

/// 5. Middleware Session
app.use(
  session({
    key: 'simap_sid',
    secret: process.env.SESSION_SECRET || 'supersecretkey_simap_2026',
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      // Tanpa maxAge -> menjadi Session Cookie (otomatis terhapus saat browser ditutup)
    },
  })
);

// 6. Health Check Endpoint
app.get('/api/koneksi', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.status(200).json({
      success: true,
      message: 'Server SIMAP Backend berjalan dengan baik.',
      database: rows[0].result === 2 ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Koneksi ke database gagal.',
      ...(isProduction ? {} : { error: error.message }),
    });
  }
});

// 7. Registrasi Routes API
app.use('/api/auth', authRoutes);
app.use('/api/jadwal', jadwalRoutes);
app.use('/api/pegawai', pegawaiRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/izin-cuti', izinCutiRoutes);
app.use('/api/rekap', rekapRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/riwayat', riwayatRoutes);

// 8. Handler Endpoint Tidak Ditemukan (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.method} ${req.originalUrl} tidak ditemukan.`,
  });
});

// 9. Global Error Handler
app.use((err, req, res, _next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server.',
  });
});

// 10. Jalankan Server
app.listen(PORT, () => {
  console.log(`Server SIMAP Backend berjalan di http://localhost:${PORT}`);
});

module.exports = app;