const express = require('express');
const router = express.Router();
const izinCutiController = require('../controllers/izin-cuti.controller');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', izinCutiController.getAll);
router.get('/:id', izinCutiController.getById);
router.post('/', izinCutiController.create);
router.put('/:id', izinCutiController.update);
router.patch('/:id/batal', izinCutiController.cancel);
router.patch('/:id/perpanjang', izinCutiController.extend);
router.patch('/:id/selesai', izinCutiController.complete);

module.exports = router;