const express = require('express');
const router = express.Router();
const pegawaiController = require('../controllers/pegawai.controller');
const { requireAuth } = require('../middlewares/auth');

// Proteksi seluruh endpoint pegawai
router.use(requireAuth);

router.get('/', pegawaiController.getAll);
router.get('/:id', pegawaiController.getById);
router.post('/', pegawaiController.create);
router.put('/:id', pegawaiController.update);
router.patch('/:id/status', pegawaiController.updateStatus);
router.delete('/:id', pegawaiController.remove);

module.exports = router;