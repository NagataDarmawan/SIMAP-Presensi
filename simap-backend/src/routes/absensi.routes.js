const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');
const { requireAuth } = require('../middlewares/auth');

// Proteksi seluruh endpoint absensi
router.use(requireAuth);

router.post('/scan', absensiController.scanQR);
router.get('/', absensiController.getHistory);
router.get('/:id', absensiController.getById);
router.put('/:id', absensiController.correct);

module.exports = router;