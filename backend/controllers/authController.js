const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { sendPasswordResetEmail, generateResetToken } = require('../utils/emailService');
const { validateEmail, validatePassword } = require('../utils/validations');

// Registrar usuário
const registerUser = async (req, res) => {
  try {
    const { name, email, cc, telefone, password } = req.body;

    // Validar formato do email
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já está em uso' });
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User({
      name,
      email,
      cc,
      telefone,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Login de usuário
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar formato do email
    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Encontrar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { userId: user._id, userType: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        type: 'user'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    // Validar formato do email
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Formato de email inválido' });
    }

    // Procurar o usuário pelo email (tanto User quanto Company)
    let user = await User.findOne({ email: email.toLowerCase() });
    let userType = 'user';
    
    if (!user) {
      user = await Company.findOne({ email: email.toLowerCase() });
      userType = 'company';
    }
    
    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return res.status(200).json({ 
        message: 'Se o email existir na nossa base de dados, receberá um link de redefinição',
        emailFound: false
      });
    }

    // Gerar token de reset
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no usuário
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    // Enviar email
    await sendPasswordResetEmail(email, resetToken, userType);

    res.status(200).json({ 
      message: 'Email de redefinição enviado com sucesso',
      emailFound: true
    });

  } catch (error) {
    console.error('Erro no forgot password:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor. Tente novamente mais tarde.' 
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token e nova password são obrigatórios' });
    }

    // Validar nova senha
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation !== null) {
      return res.status(400).json({ message: passwordValidation });
    }

    // Encontrar usuário com token válido (tanto User quanto Company)
    let user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      user = await Company.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    // Hash da nova password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar password e limpar token
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password redefinida com sucesso' });

  } catch (error) {
    console.error('Erro no reset password:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
};