const express = require('express');
const router = express.Router();
const rekapController = require('../controllers/rekap.controller');
const { requireAuth } = require('../middlewares/auth'); // Sesuaikan dengan nama middleware auth kamu

// Proteksi seluruh route rekap dengan authentication
router.use(requireAuth);

// Endpoint Laporan & Dashboard
router.get('/summary', rekapController.getSummary);
router.get('/pegawai', rekapController.getPerPegawai);
router.get('/keterlambatan', rekapController.getKeterlambatan);
router.get('/dashboard-today', rekapController.getDashboardToday);
router.get('/keterlambatan/:pegawaiId', rekapController.getDetailKeterlambatan);

module.exports = router;