const express = require('express');
const router = express.Router();
const { 
  registerUser,
  registerCompany,
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');
const {
  loginLimiter,
  forgotPasswordLimiter
} = require('../middleware/rateLimiting');
const { resetPasswordSmartLimiter } = require('../middleware/smartRateLimiting');

// Rota para registo de usuário
router.post('/register', registerUser);

// Rota para registo de empresa
router.post('/register-company', registerCompany);

// Rota para login de usuário (com rate limiting específico)
router.post('/login', loginLimiter, loginUser);

// Rota para solicitar reset de password (com rate limiting específico)
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);

// Rota para redefinir password (com smart rate limiting)
router.post('/reset-password', resetPasswordSmartLimiter, resetPassword);

module.exports = router;