const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/User');
const userRoutes = require('./routes/routeUser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua-chave-secreta-aqui',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configuração do Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Rotas de usuários
app.use('/api/users', userRoutes);

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('🍃 Conectado ao MongoDB'))
.catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ message: 'InternGO Backend API está funcionando!' });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Conexão com o backend estabelecida com sucesso!',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'
  });
});

// Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});
