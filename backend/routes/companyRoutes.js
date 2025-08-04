const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const validations = require('../utils/validations');
const { verifyToken, verifyRole } = require('../middleware/auth');


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

router.post('/register', async (req, res) => {
    const errors = await validations.validateCompanyInput(Company, req.body);

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

// Atualizar informações do perfil da empresa 
router.put('/:id', verifyToken, async (req, res) => {
    try {
        if (!req.body.morada && !req.body.codigoPostal)
        {
          return;
        }
        
        const errors = await validations.validateUserUpdate(req.body);
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: errors });
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});



module.exports = router;
