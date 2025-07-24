const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/users/register - Registar novo usuário
router.post('/register', async (req, res) => {
  try {
    // RQEUIRED: name, email, cc, telefone, password
    const { name, email, cc, telefone, password } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!name || !email || !cc || !telefone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
        required: ['name', 'email', 'cc', 'telefone', 'password']
      });
    }

    // Verificar se o usuário já existe
    const existingUser = await User.findOne({ 
      // Procura atraves do email ou cartão de cidadão
      $or: [{ email }, { cc }, {telefone} ] 
    });
    
    // Se ja houver um estagiario com aquele email ou cc aparece a msg de erro
    if (existingUser) {
      
      if (existingUser.email === email || existingUser.cc === cc || existingUser.telefone === telefone) {
        return res.status(400).json({
          success: false,
          message: 'Já existe uma conta com este email, cartão de cidadão ou telefone',
          suggestion: 'Se já tens uma conta, faz login.',
          action: 'login'
        });
      } 
    }

    // Hash da senha com bcrypt
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Criar novo usuário
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      cc: cc.trim(),
      telefone: telefone.trim(),
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    // Gerar JWT token
    const token = jwt.sign(
      { 
        id: savedUser._id, 
        email: savedUser.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    res.status(201).json({
      success: true,
      message: 'Usuário registado com sucesso',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        cc: savedUser.cc,
        telefone: savedUser.telefone,
        createdAt: savedUser.createdAt
      }
    });

  } catch (error) {
    console.error('Erro ao registar usuário:', error);
    
    // Tratar erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/users/login - Login do usuário
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar se email e senha foram fornecidos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e palavra-passe são obrigatórios'
      });
    }

    // Buscar usuário por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou palavra-passe incorretos'
      });
    }

    // Verificar senha com bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou palavra-passe incorretos'
      });
    }

    // Gerar JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cc: user.cc,
        telefone: user.telefone
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});
/*
// GET /api/users/profile - Obter perfil do usuário logado
router.get('/profile', verifyToken, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      cc: req.user.cc,
      telefone: req.user.telefone,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt
    }
  });
});*/
/*
// PUT /api/users/profile - Atualizar perfil do usuário
router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { name, telefone } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (telefone) updateData.telefone = telefone.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        cc: updatedUser.cc,
        telefone: updatedUser.telefone,
        updatedAt: updatedUser.updatedAt
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar perfil'
    });
  }
});*/
/** 
// POST /api/users/change-password - Alterar senha
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Palavra-passe atual e nova são obrigatórias'
      });
    }

    // Buscar usuário com senha
    const user = await User.findById(req.user._id);
    
    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Palavra-passe atual incorreta'
      });
    }

    // Hash da nova senha
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await User.findByIdAndUpdate(req.user._id, { 
      password: hashedNewPassword 
    });

    res.json({
      success: true,
      message: 'Palavra-passe alterada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});*/

module.exports = router;
