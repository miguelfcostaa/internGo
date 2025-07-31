const mongoose = require('mongoose');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar:', err));

// Schema do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  cc: String,
  telefone: String,
  password: String,
  active: { type: Boolean, default: true },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function getResetToken() {
  try {
    const user = await User.findOne({ email: 'teste@gmail.com' });
    if (user && user.resetPasswordToken) {
      console.log('🔗 Link de reset:');
      console.log(`http://localhost:3000/reset-password?token=${user.resetPasswordToken}`);
      console.log('🕐 Expira em:', user.resetPasswordExpires);
    } else {
      console.log('❌ Nenhum token encontrado para este usuário');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    mongoose.disconnect();
  }
}

getResetToken();
