const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

// POST /api/users/register - Registar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, cc, telefone, password } = req.body;

    // Verificar se todos os campos obrigatórios estão presentes
    if (!name || !email || !cc || !telefone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios',
        required: ['name', 'email', 'cc', 'telefone', 'password']
      });
    }

    // Criar novo usuário
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      cc: cc.trim(),
      telefone: telefone.trim()
    });

    // Registar com passport-local-mongoose (hash automático da password)
    User.register(newUser, password, (err, user) => {
      if (err) {
        console.error('Erro ao registar usuário:', err);
        
        // Tratar erros específicos
        if (err.name === 'UserExistsError') {
          return res.status(400).json({
            success: false,
            message: 'Email já está registado'
          });
        }
        
        if (err.code === 11000) {
          const field = Object.keys(err.keyPattern)[0];
          return res.status(400).json({
            success: false,
            message: `${field === 'cc' ? 'Cartão de cidadão' : field} já está registado`
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message || 'Erro ao registar usuário'
        });
      }

      res.status(201).json({
        success: true,
        message: 'Usuário registado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          cc: user.cc,
          telefone: user.telefone,
          createdAt: user.createdAt
        }
      });
    });

  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// POST /api/users/login - Login do usuário
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message || 'Email ou palavra-passe incorretos'
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer login'
        });
      }

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          cc: user.cc,
          telefone: user.telefone
        }
      });
    });
  })(req, res, next);
});

// POST /api/users/logout - Logout do usuário
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao fazer logout'
      });
    }
    
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  });
});

// GET /api/users/profile - Obter perfil do usuário logado
router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Faça login primeiro.'
    });
  }

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
});

// PUT /api/users/profile - Atualizar perfil do usuário
router.put('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      success: false,
      message: 'Acesso negado. Faça login primeiro.'
    });
  }

  try {
    const { name, telefone } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (telefone) updateData.telefone = telefone.trim();

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

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
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao atualizar perfil'
    });
  }
});

module.exports = router;
