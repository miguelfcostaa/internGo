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
  age: {
    type: Number,
    min: 16,
    max: 100
  },
  position: {
    type: String,
    enum: ['intern', 'employee', 'manager', 'admin'],
    default: 'intern'
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
