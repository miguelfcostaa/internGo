const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');


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
    try {
        if (req.body.email) {
            const existingCompany = await Company.findOne({ email: req.body.email });
            if (existingCompany) {
                return res.status(400).json({ message: 'Email já está em uso.' });
            }
        }
        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).json({ message: 'Passwords não coincidem.' });
        }

        if (req.body.password) { // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = {};
            for (const field in error.errors) {
                messages[field] = error.errors[field].message;
            }
            return res.status(400).json({ message: messages });
        }
        res.status(400).json({ message: 'Error creating company', error: error.message });
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
