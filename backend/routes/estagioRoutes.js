const express = require('express');
const Estagio = require('../models/Estagio');
const { verifyToken, verifyRole } = require('../middleware/auth');
const Company = require('../models/Company');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const filtros = {};

        if (req.query.area) {
            filtros.area = { $in: Array.isArray(req.query.area) ? req.query.area : [req.query.area] };
        }
        if (req.query.localizacao) {
            filtros.localizacao = { $in: Array.isArray(req.query.localizacao) ? req.query.localizacao : [req.query.localizacao] };
        }
        if (req.query.duracao) {
            filtros.duracao = { $in: Array.isArray(req.query.duracao) ? req.query.duracao : [req.query.duracao] };
        }
        if (req.query.tipoEstagio) {
            filtros.tipoEstagio = { $in: Array.isArray(req.query.tipoEstagio) ? req.query.tipoEstagio : [req.query.tipoEstagio] };
        }

        const estagios = await Estagio.find(filtros).populate('company', 'name');
        res.json(estagios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágios', error });
    }
});

router.get('/nEstagios/:companyId', async (req, res) => {
    try {
        const nEstagios = await Estagio.countDocuments({ company: req.params.companyId });
        res.json({ nEstagios });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar estágios', error });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const estagio = await Estagio.findById(req.params.id);
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json(estagio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágio', error });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const estagioData = req.body;
        estagioData.company = await Company.findById(req.user.id);

        const novoEstagio = new Estagio(estagioData);
        await novoEstagio.save();
        res.status(201).json(novoEstagio);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar estágio', error });
    }
});

router.get('/company/:companyId', async (req, res) => {
    try {
        const estagios = await Estagio.find({ company: req.params.companyId });
        res.json(estagios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágios da empresa', error });
    }
});


module.exports = router;