const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar:', err));

// Schema da empresa
const companySchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  nif: String,
  image: String,
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null }
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

async function createTestCompany() {
  try {
    // Verificar se a empresa já existe
    const existingCompany = await Company.findOne({ email: 'empresa@teste.com' });
    if (existingCompany) {
      console.log('Empresa de teste já existe:', existingCompany.email);
      return;
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar empresa de teste
    const testCompany = new Company({
      name: 'Empresa Teste Lda',
      email: 'empresa@teste.com',
      password: hashedPassword,
      phone: '912345678',
      nif: '123456789'
    });

    await testCompany.save();
    console.log('✅ Empresa de teste criada com sucesso!');
    console.log('Email: empresa@teste.com');
    console.log('Password: 123456');
    console.log('Nome: Empresa Teste Lda');
    
  } catch (error) {
    console.error('❌ Erro ao criar empresa:', error);
  } finally {
    mongoose.disconnect();
  }
}

createTestCompany();
