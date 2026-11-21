const express = require('express');
const router = express.Router();
const absensiController = require('../controllers/absensi.controller');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.post('/scan', absensiController.scanQR);
router.get('/harian', absensiController.getHarian);
router.post('/manual', absensiController.createManual);
router.post('/auto-alpha', absensiController.autoAlpha);
router.get('/', absensiController.getHistory);
router.get('/:id', absensiController.getById);
router.put('/:id', absensiController.correct);

module.exports = router;