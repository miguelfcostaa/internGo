// CORREÇÃO - ADICIONAR PHONE À EMPRESA ACIN
// Execute apenas SE o teste forgot falhar
// node corrigir-phone.js

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Company = require('./models/Company');

async function corrigirPhone() {
  try {
    console.log('🔧 CORRIGINDO CAMPO PHONE NA EMPRESA ACIN...\n');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
    
    // Encontrar a empresa Acin
    const acin = await Company.findOne({ email: 'acin@mail.com' });
    
    if (!acin) {
      console.log('❌ Empresa Acin não encontrada');
      return;
    }
    
    console.log(`📋 Empresa encontrada: ${acin.name}`);
    console.log(`📞 Phone atual: ${acin.phone || 'NÃO DEFINIDO'}`);
    
    if (!acin.phone) {
      console.log('🔧 Adicionando phone temporário...');
      
      // Atualizar com phone temporário
      await Company.findByIdAndUpdate(acin._id, {
        phone: '123456789' // Phone temporário
      });
      
      console.log('✅ Phone adicionado com sucesso!');
      console.log('📞 Phone: 123456789 (temporário)');
    } else {
      console.log('✅ Phone já está definido');
    }
    
    console.log('\n🎉 Correção concluída!');
    console.log('💡 Agora tente novamente: node teste-forgot.js');
    
  } catch (error) {
    console.error('❌ Erro na correção:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

corrigirPhone();
