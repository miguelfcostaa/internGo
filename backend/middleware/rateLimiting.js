const rateLimit = require('express-rate-limit');

// Rate limiting geral para todas as rotas de autenticação
const authGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // máximo 20 tentativas por IP
  message: {
    error: 'Muitas tentativas de autenticação',
    message: 'Tente novamente em 15 minutos',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting específico para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 15, // máximo 5 tentativas de login por IP
  message: {
    error: 'Muitas tentativas de login',
    message: 'Tente novamente em 15 minutos',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para solicitações de forgot password
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // máximo 3 tentativas por IP
  message: {
    error: 'Muitas solicitações de recuperação de senha',
    message: 'Tente novamente em 1 hora',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});



module.exports = {
  authGeneralLimiter,
  loginLimiter,
<<<<<<< HEAD
  forgotPasswordLimiter,
=======
  forgotPasswordLimiter
>>>>>>> 55deef8c71552a2ee72742b747145382f089061a
};
