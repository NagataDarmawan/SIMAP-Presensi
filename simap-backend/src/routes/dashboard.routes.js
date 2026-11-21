const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middlewares/auth');

router.use(requireAuth);
router.get('/stats', dashboardController.getStats);

module.exports = router;