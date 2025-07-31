const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

async function createTestUser() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email: 'teste@gmail.com' });
    if (existingUser) {
      console.log('Usuário de teste já existe:', existingUser.email);
      return;
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário de teste
    const testUser = new User({
      name: 'Usuário Teste',
      email: 'teste@gmail.com',
      cc: '12345678',
      telefone: '912345678',
      password: hashedPassword
    });

    await testUser.save();
    console.log('✅ Usuário de teste criado com sucesso!');
    console.log('Email: teste@gmail.com');
    console.log('Password: 123456');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário:', error);
  } finally {
    mongoose.disconnect();
  }
}

createTestUser();
