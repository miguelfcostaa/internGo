// ================================
// SCRIPT DE VERIFICAÇÃO COMPLETA
// ================================
// Execute: node verificar-sistema.js

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');
const Company = require('./models/Company');
const User = require('./models/User');

async function verificarSistema() {
  console.log('🔧 VERIFICAÇÃO COMPLETA DO SISTEMA DE EMAILS\n');
  
  // ================================
  // 1. VERIFICAR VARIÁVEIS DE AMBIENTE
  // ================================
  console.log('1️⃣ VARIÁVEIS DE AMBIENTE:');
  const variaveis = {
    'MONGODB_URI': process.env.MONGODB_URI ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA',
    'JWT_SECRET': process.env.JWT_SECRET ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA', 
    'EMAIL_USER': process.env.EMAIL_USER ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA',
    'EMAIL_PASS': process.env.EMAIL_PASS ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA',
    'FRONTEND_URL': process.env.FRONTEND_URL ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA'
  };
  
  Object.entries(variaveis).forEach(([chave, status]) => {
    console.log(`   ${chave}: ${status}`);
  });
  
  if (Object.values(variaveis).some(status => status.includes('❌'))) {
    console.log('\n❌ ERRO: Algumas variáveis essenciais não estão definidas!');
    return;
  }
  
  try {
    // ================================
    // 2. CONECTAR AO MONGODB
    // ================================
    console.log('\n2️⃣ CONEXÃO MONGODB:');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('   ✅ Conectado ao MongoDB');
    
    // ================================
    // 3. VERIFICAR COMPANIES NO BANCO
    // ================================
    console.log('\n3️⃣ COMPANIES NO BANCO DE DADOS:');
    const companies = await Company.find().limit(5);
    console.log(`   📊 Total de companies encontradas: ${companies.length}`);
    
    if (companies.length === 0) {
      console.log('   ❌ ERRO: Nenhuma company encontrada no banco!');
      console.log('   💡 SOLUÇÃO: Registre uma company primeiro');
      return;
    }
    
    companies.forEach((company, index) => {
      console.log(`   ${index + 1}. ${company.name} - ${company.email}`);
    });
    
    // ================================
    // 4. TESTAR BUSCA DE COMPANY
    // ================================
    console.log('\n4️⃣ TESTE DE BUSCA:');
    const emailTeste = companies[0].email;
    console.log(`   🔍 Testando com email: ${emailTeste}`);
    
    // Simular o processo do authController
    let user = await User.findOne({ email: emailTeste.toLowerCase() });
    let userType = 'user';
    
    if (!user) {
      user = await Company.findOne({ email: emailTeste.toLowerCase() });
      userType = 'company';
    }
    
    if (user && userType === 'company') {
      console.log('   ✅ Company encontrada corretamente');
      console.log(`   👤 Nome: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
    } else {
      console.log('   ❌ ERRO: Company não foi encontrada na busca');
      return;
    }
    
    // ================================
    // 5. VERIFICAR ESTRUTURA DA COMPANY
    // ================================
    console.log('\n5️⃣ ESTRUTURA DA COMPANY:');
    const camposEssenciais = ['name', 'email', 'password', 'phone', 'nif'];
    let estruturaOk = true;
    
    camposEssenciais.forEach(campo => {
      if (user[campo]) {
        console.log(`   ✅ ${campo}: ${campo === 'password' ? '[OCULTO]' : user[campo]}`);
      } else {
        console.log(`   ❌ ${campo}: NÃO DEFINIDO`);
        estruturaOk = false;
      }
    });
    
    if (!estruturaOk) {
      console.log('   ⚠️ AVISO: Alguns campos essenciais não estão definidos');
    }
    
    // ================================
    // 6. TESTAR CONEXÃO DE EMAIL
    // ================================
    console.log('\n6️⃣ TESTE DE CONEXÃO EMAIL:');
    try {
      const { testEmailConnection } = require('./utils/emailService');
      const emailOk = await testEmailConnection();
      if (emailOk) {
        console.log('   ✅ Conexão de email funcionando');
      } else {
        console.log('   ❌ ERRO: Falha na conexão de email');
      }
    } catch (error) {
      console.log('   ❌ ERRO no teste de email:', error.message);
    }
    
    console.log('\n🎉 VERIFICAÇÃO CONCLUÍDA!');
    console.log('\n📋 RESUMO:');
    console.log('   • Variáveis de ambiente: OK');
    console.log('   • Conexão MongoDB: OK');
    console.log(`   • Companies no banco: ${companies.length} encontrada(s)`);
    console.log('   • Busca de company: OK');
    console.log('   • Conexão de email: Testada');
    
  } catch (error) {
    console.error('\n❌ ERRO na verificação:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Executar verificação
verificarSistema();
