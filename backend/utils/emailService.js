const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Configurar transporter para desenvolvimento (Ethereal Email para testes)
const createTestTransporter = async () => {
  // Criar conta de teste
  let testAccount = await nodemailer.createTestAccount();
  
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// Configurar transporter do Gmail (produção)
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Função para gerar token de reset
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Função para enviar email de reset de password
const sendPasswordResetEmail = async (email, resetToken, userType = 'user') => {
  console.log('🔧 Tentando enviar email para:', email, `(${userType})`);
  
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  // Personalizar mensagem baseada no tipo de usuário
  const userTypeName = userType === 'company' ? 'empresa' : 'usuário';
  const accountType = userType === 'company' ? 'da empresa' : 'pessoal';
  
  const mailOptions = {
    from: '"InternGo" <noreply@interngo.com>',
    to: email,
    subject: `Redefinição de Palavra-passe - InternGo (${userType === 'company' ? 'Empresa' : 'Usuário'})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #273F4F;">Redefinir Palavra-passe</h2>
        <p>Olá,</p>
        <p>Recebeu este email porque foi solicitada uma redefinição de palavra-passe para a sua conta ${accountType} no InternGo.</p>
        <p>Clique no botão abaixo para redefinir a sua palavra-passe:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #273F4F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Redefinir Palavra-passe
          </a>
        </div>
        
        <p>Se não conseguir clicar no botão, copie e cole o seguinte link no seu navegador:</p>
        <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
        
        <p><strong>Este link expira em 1 hora.</strong></p>
        
        <p>Se não solicitou esta redefinição, pode ignorar este email.</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          Este é um email automático, por favor não responda.<br>
          <strong>Tipo de conta:</strong> ${userTypeName.charAt(0).toUpperCase() + userTypeName.slice(1)}
        </p>
      </div>
    `
  };

  try {
    let transporter;
    
    // Tentar Gmail primeiro, se falhar usar Ethereal para testes
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        transporter = createGmailTransporter();
        await transporter.verify();
        console.log('✅ Usando Gmail para envio');
      } catch (gmailError) {
        console.log('⚠️ Gmail falhou, usando serviço de teste');
        transporter = await createTestTransporter();
      }
    } else {
      console.log('⚠️ Credenciais Gmail não configuradas, usando serviço de teste');
      transporter = await createTestTransporter();
    }

    console.log('📧 Enviando email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso:', info.messageId);
    
    // Se for Ethereal, mostrar URL de preview
    if (info.messageId.includes('ethereal')) {
      console.log('📧 Preview URL (APENAS DESENVOLVIMENTO):', nodemailer.getTestMessageUrl(info));
      console.log('🔗 Link de reset gerado:', resetUrl);
    }
    
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('❌ Erro detalhado ao enviar email:', error);
    throw new Error('Falha ao enviar email');
  }
};

// Função para verificar se o email service está funcionando
const testEmailConnection = async () => {
  console.log('🔧 Testando conexão de email...');
  
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = createGmailTransporter();
      await transporter.verify();
      console.log('✅ Gmail: Conexão estabelecida com sucesso');
      return true;
    } else {
      console.log('⚠️ Credenciais Gmail não configuradas');
      const transporter = await createTestTransporter();
      await transporter.verify();
      console.log('✅ Serviço de teste: Conexão estabelecida com sucesso');
      return true;
    }
  } catch (error) {
    console.error('❌ Erro na conexão de email:', error.message);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  generateResetToken,
  testEmailConnection
};
