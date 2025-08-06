// TESTE SIMPLES - FORGOT PASSWORD COMPANY
// Execute: node teste-forgot.js

const http = require('http');

// Usar o email da empresa que foi encontrada na verificação
const EMAIL_TESTE = 'acin@mail.com'; // ✅ Este email existe na verificação

console.log('🚀 TESTANDO FORGOT PASSWORD PARA COMPANY');
console.log(`📧 Email teste: ${EMAIL_TESTE}`);
console.log('⏳ Enviando requisição...\n');

const postData = JSON.stringify({ email: EMAIL_TESTE });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/forgot-password',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`📊 Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('📧 Resposta:', result);
      
      if (res.statusCode === 200 && result.emailFound) {
        console.log('\n✅ SUCESSO! Email foi processado');
        console.log('💡 Verificar caixa de entrada (incluindo spam)');
      } else {
        console.log('\n❌ PROBLEMA detectado');
        console.log('💡 Verificar se o email existe como company');
      }
    } catch (e) {
      console.log('❌ Erro ao processar resposta:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ ERRO:', error.message);
  console.log('\n💡 POSSÍVEIS CAUSAS:');
  console.log('   • Servidor backend não está rodando');
  console.log('   • Porta 5000 ocupada por outro processo');
});

req.write(postData);
req.end();
