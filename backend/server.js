const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRoutes = require('./routes/userRoutes');
const estagioRoutes = require('./routes/estagioRoutes');
const companyRoutes = require('./routes/companyRoutes');
const authRoutes = require('./routes/authRoutes');
const { testEmailConnection } = require('./utils/emailService');

const Company = require('./models/Company');
const User = require('./models/User');
const Estagio = require('./models/Estagio');

require('dotenv').config();

const app = express();
//Porta do Backend
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas de usuários
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/estagios', estagioRoutes);
app.use('/api/auth', authRoutes);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('🍃 Conectado ao MongoDB');
  // Testar conexão de email
  testEmailConnection();
})
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));


// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'InternGO Backend API está funcionando!' });
});

// Rota de teste para verificar conexão
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Conexão com o backend estabelecida com sucesso!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios.' });
  }

  try {
    const company = await Company.findOne({ email });
    const user = await User.findOne({ email });

    if (company) {
      const isMatch = await bcrypt.compare(password, company.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password incorreta.' });
      }

      const token = jwt.sign(
        { id: company._id, role: 'company' },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
      );

      return res.status(200).json({ role: 'company', token });
    }

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Password incorreta.' });
      }

      const token = jwt.sign(
        { id: user._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
      );

      return res.status(200).json({ role: 'user', token });
    }

    // Se nenhum dos dois foi encontrado
    return res.status(404).json({ message: 'Email ou password incorretos.' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
  }
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
