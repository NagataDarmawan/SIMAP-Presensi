const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth');

// Endpoint Public (Tanpa Login)
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/reset-password', authController.resetPassword); // Public untuk Lupa Password

// Endpoint Protected (Wajib Login)
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.getProfile);

module.exports = router;