const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoring.controller');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);

router.get('/', monitoringController.getMonitoring);

module.exports = router;