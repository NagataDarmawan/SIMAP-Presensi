const express = require('express');
const router = express.Router();
const jadwalController = require('../controllers/jadwal.controller');
const { requireAuth } = require('../middlewares/auth');

// Seluruh endpoint jadwal membutuhkan sesi login Admin
router.use(requireAuth);

router.get('/', jadwalController.getAll);
router.get('/:id', jadwalController.getById);
router.post('/', jadwalController.create);
router.put('/:id', jadwalController.update);
router.delete('/:id', jadwalController.remove);

module.exports = router;