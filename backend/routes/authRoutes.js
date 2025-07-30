const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// Rota para registro de usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

// Rota para solicitar reset de password
router.post('/forgot-password', forgotPassword);

// Rota para redefinir password
router.post('/reset-password', resetPassword);

module.exports = router;