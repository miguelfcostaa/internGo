const User = require('../models/User');
const Company = require('../models/Company');
const { sendPasswordResetEmail, generateResetToken } = require('../utils/emailService');
const { validatePassword, validateCompanyInput } = require('../utils/validations');
const AuthService = require('../services/authService');
const UserService = require('../services/userService');
const CompanyService = require('../services/companyService');

// Registrar usuário
const registerUser = async (req, res) => {
  try {
    const { name, email, cc, telefone, password } = req.body;

    // Validar dados usando UserService
    const validation = UserService.validateRegistrationData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: validation.errors
      });
    }

    // Verificar se o usuário já existe
    const existingUser = await UserService.findExistingUser(email, cc, telefone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Já existe uma conta com este email, cartão de cidadão ou telefone'
      });
    }

    // Hash da password usando AuthService
    const hashedPassword = await AuthService.hashPassword(password);

    // Criar usuário com dados sanitizados
    const sanitizedData = UserService.sanitizeUserData(req.body);
    const user = new User({
      ...sanitizedData,
      password: hashedPassword
    });

    const savedUser = await user.save();

    // Gerar token
    const token = AuthService.generateToken(savedUser, 'user', '7d');

    // Resposta formatada
    const response = AuthService.formatAuthSuccessResponse(
      savedUser,
      token,
      'Usuário criado com sucesso'
    );

    res.status(201).json(response);

  } catch (error) {
    console.error('Erro ao registar usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Registrar empresa
const registerCompany = async (req, res) => {
  try {
    // Adicionar confirmPassword se não estiver presente (para compatibilidade)
    if (!req.body.confirmPassword) {
      req.body.confirmPassword = req.body.password;
    }

    // Validar dados usando validateCompanyInput
    const validationErrors = await validateCompanyInput(Company, req.body);
    
    // Verificar se há erros de validação
    if (Object.keys(validationErrors).length > 0) {
      // Criar uma mensagem de erro única e limpa
      let errorMessage = '';
      
      if (validationErrors.general) {
        errorMessage = validationErrors.general;
      } else {
        // Juntar todos os erros em uma mensagem única
        const errorMessages = [];
        
        if (validationErrors.name) {
          errorMessages.push(validationErrors.name);
        }
        if (validationErrors.email) {
          errorMessages.push(validationErrors.email);
        }
        if (validationErrors.phone) {
          errorMessages.push(validationErrors.phone);
        }
        if (validationErrors.nif) {
          errorMessages.push(validationErrors.nif);
        }
        if (validationErrors.password) {
          errorMessages.push(validationErrors.password);
        }
        if (validationErrors.confirmPassword) {
          errorMessages.push(validationErrors.confirmPassword);
        }

        errorMessage = errorMessages.join('\n• ');
      }

      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    // Hash da password usando AuthService
    const hashedPassword = await AuthService.hashPassword(req.body.password);
    
    // Criar empresa com dados sanitizados
    const sanitizedData = CompanyService.sanitizeCompanyData(req.body);
    const company = new Company({
      ...sanitizedData,
      password: hashedPassword
    });
    
    const savedCompany = await company.save();
    
    // Gerar token
    const token = AuthService.generateToken(savedCompany, 'company', '7d');
    
    // Resposta formatada
    const response = AuthService.formatAuthSuccessResponse(
      savedCompany,
      token,
      'Empresa registrada com sucesso'
    );
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Erro ao registrar empresa:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor ao registrar empresa'
    });
  }
};

// Login de usuário ou empresa
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar dados de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e password são obrigatórios'
      });
    }

    // Validar formato do email usando AuthService
    if (!AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Procurar primeiro em usuários
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      // Verificar password usando AuthService
      const isMatch = await AuthService.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT para usuário
      const token = AuthService.generateToken(user, 'user', '7d');

      // Resposta formatada
      const response = AuthService.formatAuthSuccessResponse(
        user,
        token,
        'Login realizado com sucesso'
      );

      return res.json(response);
    }

    // Se não encontrou usuário, procurar em empresas
    const company = await Company.findOne({ email: email.toLowerCase() });
    if (company) {
      // Verificar password usando AuthService
      const isMatch = await AuthService.comparePassword(password, company.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT para empresa
      const token = AuthService.generateToken(company, 'company', '7d');

      // Resposta formatada
      const response = AuthService.formatAuthSuccessResponse(
        company,
        token,
        'Login realizado com sucesso'
      );

      return res.json(response);
    }

    // Se não encontrou nem usuário nem empresa
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email é obrigatório'
      });
    }

    // Validar formato do email usando AuthService
    if (!AuthService.isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
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
        success: true,
        message: 'Se o email existir na nossa base de dados, receberá um link de redefinição',
        emailFound: false
      });
    }

    // Gerar token de reset
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no usuário
    if (userType === 'user') {
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });
    } else {
      await Company.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });
    }

    // Enviar email
    await sendPasswordResetEmail(email, resetToken, userType);

    res.status(200).json({ 
      success: true,
      message: 'Email de redefinição enviado com sucesso',
      emailFound: true
    });

  } catch (error) {
    console.error('Erro no forgot password:', error);
    res.status(500).json({ 
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.' 
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token e nova password são obrigatórios'
      });
    }

    // Validar nova senha usando os critérios do validations.js
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      return res.status(400).json({
        success: false,
        message: passwordError
      });
    }

    // Encontrar usuário com token válido (tanto User quanto Company)
    let user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    let userType = 'user';
    if (!user) {
      user = await Company.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
      userType = 'company';
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Hash da nova password usando AuthService
    const hashedPassword = await AuthService.hashPassword(newPassword);

    // Atualizar password e limpar token
    if (userType === 'user') {
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
    } else {
      await Company.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password redefinida com sucesso'
    });

  } catch (error) {
    console.error('Erro no reset password:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  registerUser,
  registerCompany,
  loginUser,
  forgotPassword,
  resetPassword
};