const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
    criarEstagio,
    obterEstagios,
    obterEstagiosPorEmpresa,
    obterEstagio,
    contarEstagios,
    alterarEstadoEstagio,
    atualizarEstagio,
    deletarEstagio
} = require('../controllers/estagioController');

// Rotas para estágios
router.get('/', obterEstagios);
router.get('/nEstagios/:companyId', contarEstagios);
router.get('/:id', obterEstagio);
router.post('/create', verifyToken, criarEstagio);
router.put('/:id', verifyToken, atualizarEstagio);
router.delete('/:id', verifyToken, deletarEstagio);
router.get('/company/:companyId', obterEstagiosPorEmpresa);
router.put('/alterar-estado/:id', verifyToken, alterarEstadoEstagio);

module.exports = router;