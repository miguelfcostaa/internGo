const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Company = require('../models/Company');

// Middleware que protege contra spam mas permite ajustes de senha com token válido
const resetPasswordSmartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 tentativas por IP
  message: {
    error: 'Muitas tentativas de redefinição de senha',
    message: 'Tente novamente em 15 minutos',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Função personalizada que decide se deve aplicar rate limiting
  skip: async (req, res) => {
    try {
      const { token } = req.body;
      
      // Se não há token, APLICA rate limiting (para evitar spam)
      if (!token) {
        return false;
      }

      // Verificar se token é válido (User ou Company)
      let user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        user = await Company.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }
        });
      }

      // Se token é VÁLIDO, NÃO aplica rate limiting
      // (pessoa pode tentar quantas vezes quiser ajustar critérios da senha)
      if (user) {
        return true;
      }

      // Se token é INVÁLIDO/expirado, APLICA rate limiting
      // (para evitar spam de tokens inválidos)
      return false;
    } catch (error) {
      console.error('Erro no smart rate limiter:', error);
      // Em caso de erro, aplica rate limiting por segurança
      return false;
    }
  }
});

module.exports = {
  resetPasswordSmartLimiter
};
