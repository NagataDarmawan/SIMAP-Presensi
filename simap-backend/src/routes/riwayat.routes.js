const express = require('express');
const router = express.Router();
const riwayatController = require('../controllers/riwayat.controller');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', riwayatController.getRiwayat);
router.get('/:id', riwayatController.getRiwayatById);

module.exports = router;