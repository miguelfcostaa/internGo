const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const {
  loginLimiter,
  forgotPasswordLimiter
} = require('../middleware/rateLimiting');
const { resetPasswordSmartLimiter } = require('../middleware/smartRateLimiting');

// Rota para login de usuário (APENAS rate limiting específico)
router.post('/login', loginLimiter, loginUser);

// Rota para solicitar reset de password (APENAS rate limiting específico)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);

// Rota para redefinir password (com smart rate limiting)
router.post('/reset-password', resetPasswordSmartLimiter, resetPassword);

module.exports = router;