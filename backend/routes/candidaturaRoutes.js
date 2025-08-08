const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const candidaturaController = require('../controllers/candidaturaController');

// Buscar todas as candidaturas
router.get('/', verifyToken, candidaturaController.getAllCandidaturas);

// Buscar candidatura por ID
router.get('/:candidaturaId', verifyToken, candidaturaController.getCandidaturaById);

// Buscar candidaturas de uma empresa
router.get('/empresa/:companyId', verifyToken, candidaturaController.getCandidaturasByCompany);

// Buscar candidaturas de um usuário
router.get('/user/:userId', verifyToken, candidaturaController.getCandidaturasByUser);

// Buscar candidaturas de um estágio
router.get('/estagio/:estagioId', verifyToken, candidaturaController.getCandidaturasByEstagio);

// Criar candidatura
router.post('/candidatar/:estagioId', verifyToken, candidaturaController.createCandidatura);

// Debug candidatura
router.get('/:candidaturaId/debug', verifyToken, candidaturaController.debugCandidatura);

// Aceitar candidatura
router.put('/:candidaturaId/aceitar', verifyToken, candidaturaController.aceitarCandidatura);

// Recusar candidatura
router.put('/:candidaturaId/recusar', verifyToken, candidaturaController.recusarCandidatura);

module.exports = router;