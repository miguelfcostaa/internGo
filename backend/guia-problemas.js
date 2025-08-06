// =============================================
// GUIA DE SOLUÇÃO DE PROBLEMAS RÁPIDOS
// =============================================

/* 
❌ ERRO: "Cannot find module './models/Company'"
💡 SOLUÇÃO: Está no diretório errado
   → cd backend (entrar na pasta backend)

❌ ERRO: "MONGODB_URI: undefined"  
💡 SOLUÇÃO: Arquivo .env não existe ou não está sendo lido
   → Verificar se .env existe na pasta backend
   → Adicionar require('dotenv').config() no início do server.js

❌ ERRO: "listen EADDRINUSE :::5000"
💡 SOLUÇÃO: Porta 5000 já está em uso
   → taskkill /F /IM node.exe (encerrar todos os node)
   → Ou usar outra porta no .env: PORT=5001

❌ ERRO: "MongooseError: uri parameter must be string"
💡 SOLUÇÃO: MongoDB URI não está definido
   → Verificar MONGODB_URI no arquivo .env
   → Copiar a string de conexão correta

❌ ERRO: "Company validation failed: phone required"
💡 SOLUÇÃO: Problema já foi corrigido no código
   → Verificar se authController.js usa findByIdAndUpdate()

❌ ERRO: "Gmail connection failed"
💡 SOLUÇÃO: Credenciais de email incorretas
   → Verificar EMAIL_USER e EMAIL_PASS no .env
   → Verificar se a senha de app do Gmail está correta

❌ Status 200 mas emailFound: false
💡 SOLUÇÃO: Email não existe como company no banco
   → Registrar uma empresa primeiro
   → Ou usar email de empresa existente

❌ Status 200, emailFound: true, mas não recebe email
💡 SOLUÇÃO: Email foi enviado mas não chegou
   → Verificar pasta de spam/lixo eletrônico
   → Verificar se o email de destino está correto
   → Logs do servidor mostram "Email enviado com sucesso"?
*/

console.log('📋 Consulte os comentários deste arquivo para soluções rápidas!');
console.log('🔧 Execute: node verificar-sistema.js primeiro');
console.log('🚀 Depois execute: node teste-forgot.js');
