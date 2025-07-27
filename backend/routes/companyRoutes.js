const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const validations = require('../utils/validations');


router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
});

router.get('/register', (req, res) => {
    res.json({ message: "Company registration route is working!" });
});


router.get('/login', (req, res) => {
    res.json({ message: "Company login route is working!" });
});

router.post('/register', async (req, res) => {
    const errors = await validations.validateCompanyInput(req.body);

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: errors });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);

        const company = new Company(req.body);
        await company.save();

        return res.status(201).json(company);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    }
});


module.exports = router;
