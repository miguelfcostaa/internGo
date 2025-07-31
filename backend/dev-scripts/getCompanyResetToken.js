const mongoose = require('mongoose');
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

async function getCompanyResetToken() {
  try {
    const company = await Company.findOne({ email: 'empresa@teste.com' });
    if (company && company.resetPasswordToken) {
      console.log('🏢 Empresa encontrada:', company.name);
      console.log('🔗 Link de reset:');
      console.log(`http://localhost:3000/reset-password?token=${company.resetPasswordToken}`);
      console.log('🕐 Expira em:', company.resetPasswordExpires);
    } else {
      console.log('❌ Nenhum token encontrado para esta empresa');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    mongoose.disconnect();
  }
}

getCompanyResetToken();
