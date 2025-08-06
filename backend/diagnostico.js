// DIAGNÓSTICO RÁPIDO - Uma linha só
// Execute: node diagnostico.js

require('dotenv').config();
console.log('🔧 DIAGNÓSTICO RÁPIDO:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'OK' : 'ERRO - não definida');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'OK' : 'ERRO - não definida');  
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'OK' : 'ERRO - não definida');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'ERRO - não definida');
console.log('\n💡 Se algum mostrou ERRO, corrigir o arquivo .env primeiro!');

if (process.env.MONGODB_URI && process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.JWT_SECRET) {
  console.log('✅ Configuração básica OK - pode testar o sistema');
} else {
  console.log('❌ Configuração incompleta - corrigir .env primeiro');
}
