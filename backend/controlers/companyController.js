const Company = require('../models/companyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error creating company', error });
    }
};