const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/auth');
const {
    criarEstagio,
    obterEstagios,
    obterEstagiosPorEmpresa,
    obterEstagio,
    obterEstagioById,
    contarEstagios,
    alterarEstadoEstagio,
    atualizarEstagio,
    deletarEstagio,
    obterOpcoesFiltros,
    buscarEstagios
} = require('../controllers/estagioController');

// Rotas para estágios
router.get('/', obterEstagios);
router.get('/buscar', buscarEstagios);
router.get('/filtros/opcoes', obterOpcoesFiltros);
router.get('/nEstagios/:companyId', contarEstagios);
router.get('/:id', obterEstagioById);
router.post('/create', verifyToken, criarEstagio);
router.put('/:id', verifyToken, atualizarEstagio);
router.delete('/:id', verifyToken, deletarEstagio);
router.get('/company/:companyId', obterEstagiosPorEmpresa);
router.put('/alterar-estado/:id', verifyToken, alterarEstadoEstagio);

module.exports = router;