const express = require('express');
const router = express.Router();
const Candidatura = require('../models/Candidatura');
const Estagio = require('../models/Estagio');
const { verifyToken, verifyRole } = require('../middleware/auth');
const Company = require('../models/Company');
const validations = require('../utils/validations');


router.get('/', verifyToken, async (req, res) => {
    try {
        const candidaturas = await Candidatura
            .find()
            .populate({
                path: 'estagio',
                populate: { path: 'company', select: 'name' }
            })
            .populate('user');

        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma candidatura encontrada.' });
        }

        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidaturas', error });
    }
});

// Rota para buscar candidaturas de um estágio específico
router.get('/:candidaturaId', verifyToken, async (req, res) => {
    try {
        const candidatura = await Candidatura
            .findById(req.params.candidaturaId)
            .populate({
                path: 'estagio',
                populate: { path: 'company', select: 'name' }
            })
            .populate('user');

        if (!candidatura) {
            return res.status(404).json({ message: 'Candidatura não encontrada.' });
        }

        res.json(candidatura);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidatura', error });
    }
});

// Rota para buscar todas as candidaturas a uma empresa 
router.get('/empresa/:companyId', verifyToken, async (req, res) => {
    try {
        // 1. Buscar todos os estágios da empresa
        const estagios = await Estagio.find({ company: req.params.companyId }).select('_id');
        const estagioIds = estagios.map(e => e._id);

        // 2. Buscar candidaturas desses estágios
        const candidaturas = await Candidatura
            .find({ estagio: { $in: estagioIds } })
            .populate({
                path: 'estagio',
                populate: { path: 'company', select: 'name' }
            })
            .populate('user');

        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma candidatura encontrada.' });
        }

        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidaturas', error });
    }
});


// Rota para buscar todas as candidaturas de um user
router.get('/user/:userId', async (req, res) => {
    try {
        const candidaturas = await Candidatura
            .find({ user: req.params.userId })
            .populate({
                path: 'estagio',
                populate: { path: 'company', select: 'name' }
            })

        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma candidatura encontrada.' });
        }

        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidaturas', error });
    }
});


// Rota para buscar candidaturas de um estágio específico
router.get('/estagio/:estagioId', async (req, res) => {
    try {
        const candidaturas = await Candidatura
            .find({ estagio: req.params.estagioId })
            .populate('user')
            .populate({
                path: 'estagio',
                populate: { path: 'company', select: 'name' }
            });
        
        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma candidatura encontrada para este estágio.' });
        }

        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidaturas', error });
    }
});

// Rota para candidatar-se a um estágio
router.post('/candidatar/:estagioId', verifyToken, async (req, res) => {
    const errors = await validations.validateCandidatura(req.body);
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: errors });
    }

    try {
        const estagioId = req.params.estagioId;
        const userId = req.user.id;

        // Verificar se o usuário é uma empresa - EMPRESAS NÃO PODEM CANDIDATAR-SE
        if (req.user.role === 'company') {
            return res.status(403).json({ 
                message: 'Empresas não podem candidatar-se aos estágios. Apenas estudantes podem candidatar-se.' 
            });
        }

        // Verificar se o usuário é um estudante
        if (req.user.role !== 'user') {
            return res.status(403).json({ 
                message: 'Apenas estudantes podem candidatar-se aos estágios.' 
            });
        }

        // Verifica se já existe candidatura
        const existe = await Candidatura.findOne({ user: userId, estagio: estagioId });
        if (existe) {
            return res.status(400).json({ message: 'Já se candidatou a este estágio.' });
        }

        const candidatura = new Candidatura({ user: userId, estagio: estagioId });
        await candidatura.save();
        res.status(201).json(candidatura);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao candidatar-se.', error });
    }
});

module.exports = router;