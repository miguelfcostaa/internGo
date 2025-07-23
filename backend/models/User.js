const mongoose = require('mongoose');

// Schema para usuário
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  cc: {
    type: String,
    required: [true, 'Número do cartão de cidadão é obrigatório'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{8}$/.test(v); 
      },
      message: 'Número do cartão de cidadão deve ter exatamente 8 dígitos'
    }
  },
  telefone: {
    type: String,
    required: [true, 'Número de telemóvel é obrigatório'],
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Aceita formatos: 9xxxxxxxx ou +351xxxxxxxxx
        return /^(\+351)?9\d{8}$/.test(v);
      },
      message: 'Número de telemóvel deve ter formato válido (9xxxxxxxx ou +351xxxxxxxxx)'
    }
  },
  password: {
    type: String,
    required: [true, 'Palavra-passe é obrigatória'],
    minlength: [6, 'Palavra-passe deve ter pelo menos 6 caracteres']
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Exportar o modelo
module.exports = mongoose.model('User', userSchema);
