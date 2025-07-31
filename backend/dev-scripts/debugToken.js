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

async function debugToken() {
  try {
    const company = await Company.findOne({ email: 'empresa@teste.com' });
    if (company) {
      console.log('🔧 Empresa encontrada:', company.name);
      console.log('🔧 Token completo:', company.resetPasswordToken);
      console.log('🔧 Tamanho do token:', company.resetPasswordToken ? company.resetPasswordToken.length : 'null');
      console.log('🔧 Expira em:', company.resetPasswordExpires);
      console.log('🔧 Data atual:', new Date());
      console.log('🔧 Token válido?', company.resetPasswordExpires > Date.now());
      
      // Tentar encontrar diretamente
      const tokenSearch = await Company.findOne({
        resetPasswordToken: company.resetPasswordToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
      
      console.log('🔧 Busca por token funcionou?', tokenSearch ? 'SIM' : 'NÃO');
    }
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    mongoose.disconnect();
  }
}

debugToken();
