const express = require('express');
const Estagio = require('../models/Estagio');
const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const estagios = await Estagio.find();
        res.json(estagios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágios', error });
    }
});

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

router.post('/create', async (req, res) => {
    try {
        const estagio = new Estagio(req.body);
        await estagio.save();
        res.status(201).json(estagio);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar estágio', error });
    }
});


module.exports = router;