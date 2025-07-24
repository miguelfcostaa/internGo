const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const validateCompanyInput = require('../utils/validateCompanyInput');


router.get('/all', async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
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
    const errors = await validateCompanyInput(req.body);

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


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const company = await Company.findOne({ email });
        if (!company) {
            return res.status(404).json({ message: 'Email ou password incorretos.' });
        }
        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou password incorretos.' });
        }
        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '3d' });
        res.status(200).json({ token });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = {};
            for (const field in error.errors) {
                messages[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: messages });
        }
        return res.status(400).json({ message: 'Error finding company', error: error.message });
    }
});


module.exports = router;
