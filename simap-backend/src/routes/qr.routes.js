const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qr.controller');
const { requireAuth } = require('../middlewares/auth');

// Proteksi seluruh endpoint QR Code
router.use(requireAuth);

router.get('/', qrController.getAll);
router.get('/:pegawaiId', qrController.getByPegawaiId);
router.post('/:pegawaiId/generate', qrController.generate);
router.post('/:pegawaiId/regenerate', qrController.regenerate);

module.exports = router;