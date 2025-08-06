// ================================
// TESTE HTTP DIRETO - FORGOT PASSWORD
// ================================
// Execute: node teste-forgot-company.js

const http = require('http');

function testarForgotPassword(email) {
  console.log(`🚀 TESTANDO FORGOT PASSWORD`);
  console.log(`📧 Email: ${email}`);
  console.log(`🌐 Servidor: http://localhost:5000`);
  console.log('─'.repeat(50));

  const postData = JSON.stringify({ email });
  
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
    console.log(`⏰ Data: ${res.headers.date}`);
    
    // Verificar rate limiting
    if (res.headers['ratelimit-remaining']) {
      console.log(`🚦 Rate Limit - Restantes: ${res.headers['ratelimit-remaining']}`);
    }

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('─'.repeat(50));
      try {
        const jsonData = JSON.parse(data);
        console.log('📧 RESPOSTA:', jsonData);
        
        if (res.statusCode === 200 && jsonData.emailFound) {
          console.log('\n✅ SUCESSO! Email foi enviado para a company');
          console.log('💡 Verificar:');
          console.log('   1. Caixa de entrada do email');
          console.log('   2. Pasta de spam/lixo eletrônico');
          console.log('   3. Logs do servidor backend');
        } else if (res.statusCode === 200 && !jsonData.emailFound) {
          console.log('\n❌ Email não encontrado no sistema');
          console.log('💡 Verificar se a company está registrada');
        } else {
          console.log('\n❌ ERRO na requisição');
          console.log('💡 Verificar logs do servidor');
        }
        
      } catch (e) {
        console.log('❌ Erro ao fazer parse da resposta:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ ERRO na requisição:', error.message);
    console.log('\n💡 POSSÍVEIS CAUSAS:');
    console.log('   • Servidor backend não está rodando');
    console.log('   • Porta 5000 não está disponível');
    console.log('   • Firewall bloqueando a conexão');
  });

  req.write(postData);
  req.end();
}

// USAR EMAIL REAL DE EMPRESA QUE EXISTE NO BANCO
// ⚠️ SUBSTITUIR pelo email correto
const emailTeste = 'acin@mail.com'; // TROCAR por email real
testarForgotPassword(emailTeste);
