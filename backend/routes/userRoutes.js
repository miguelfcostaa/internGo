const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const validations = require('../utils/validations');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}); 

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userObj = user.toObject();
        userObj.role = "user";
        res.json(userObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

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
        role: "user", 
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


router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!req.body.idade && !req.body.nif && !req.body.morada && !req.body.telefone && !req.body.nacionalidade && !req.body.formacaoAcademica && !req.body.competenciasTecnicas && !req.body.aniversario) {
          return;
        }

        req.body.aniversario = req.body.aniversario ? req.body.aniversario.slice(0, 10) : null; 
        const errors = await validations.validateUserUpdate(req.body);
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: errors });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});

module.exports = router;
