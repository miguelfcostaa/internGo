const express = require('express');
const router = express.Router();
const Candidatura = require('../models/Candidatura');
const { verifyToken, verifyRole } = require('../middleware/auth');
const Company = require('../models/Company');

// Rota para buscar todas as candidaturas de um user
router.get('/user/:userId', async (req, res) => {
    try {
        const candidaturas = await Candidatura
            .find({ user: req.params.userId })
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
router.get('/estagio/:estagioId', async (req, res) => {
    try {
        const candidaturas = await Candidatura
            .find({ estagio: req.params.estagioId })
            .populate('user')
            .populate('estagio');
        
        if (!candidaturas || candidaturas.length === 0) {
            return res.status(404).json({ message: 'Nenhuma candidatura encontrada para este estágio.' });
        }

        res.json(candidaturas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar candidaturas', error });
    }
});

// Rota para candidatar-se a um estágio
router.post('/candidatar', verifyToken, async (req, res) => {
    try {
        const estagioId = req.body.estagio;
        const userId = req.user.id; 

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