const Company = require('../models/companyModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { default: Company } = require('../models/Company');

exports.createCompany = async (req, res) => {
    try {
        if (req.body.password) { // Hash the password before saving
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        const company = new Company(req.body);
        await company.save();
        res.status(201).json(company);
    } catch (error) {
        res.status(400).json({ message: 'Error creating company', error });
    }
};

exports.loginCompany = async (req, res) => {
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
        const token = jwt.sign({ id: company._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        return res.status(400).json({ message: 'Error finding company', error });
    }
}