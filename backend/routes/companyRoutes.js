const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const validations = require('../utils/validations');
const { verifyToken, verifyRole } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');
const path = require('path');
const fs = require('fs');


router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }
        const companyObj = company.toObject();
        companyObj.role = "company";
        res.json(companyObj);
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
        
        const errors = await validations.validateCompanyUpdate(Company, req.body);
        
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: errors });
        }

        const updatedCompany = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(updatedCompany);
    } catch (error) {
        console.error('Error updating company:', error);
        res.status(500).json({ message: 'Error updating company', error });
    }
});

// Upload de foto de perfil para empresa
router.post('/:id/profile-photo', verifyToken, upload.single('profilePhoto'), async (req, res) => {
    try {
        const companyId = req.params.id;
        
        // Verificar se a empresa existe
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Empresa não encontrada' 
            });
        }

        // Verificar se foi enviado um ficheiro
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Nenhuma imagem foi enviada' 
            });
        }

        // Eliminar a foto anterior se existir
        if (company.profilePhoto) {
            const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', path.basename(company.profilePhoto));
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Atualizar a empresa com o caminho da nova foto
        const photoUrl = `/uploads/profile-photos/${req.file.filename}`;
        
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { profilePhoto: photoUrl },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Foto de perfil atualizada com sucesso',
            profilePhoto: photoUrl,
            company: updatedCompany
        });

    } catch (error) {
        console.error('Erro ao fazer upload da foto:', error);
        
        // Eliminar o ficheiro que foi carregado se houve erro
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor ao fazer upload da foto' 
        });
    }
});

// Eliminar foto de perfil da empresa
router.delete('/:id/profile-photo', verifyToken, async (req, res) => {
    try {
        const companyId = req.params.id;
        
        // Verificar se a empresa existe
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ 
                success: false, 
                message: 'Empresa não encontrada' 
            });
        }

        // Verificar se a empresa tem uma foto de perfil
        if (!company.profilePhoto) {
            return res.status(400).json({ 
                success: false, 
                message: 'A empresa não tem foto de perfil para eliminar' 
            });
        }

        // Eliminar o ficheiro físico
        const photoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', path.basename(company.profilePhoto));
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        // Remover a referência da foto na base de dados
        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            { $unset: { profilePhoto: 1 } },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Foto de perfil eliminada com sucesso',
            company: updatedCompany
        });

    } catch (error) {
        console.error('Erro ao eliminar foto de perfil:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Erro interno do servidor ao eliminar foto' 
        });
    }
});

module.exports = router;
