const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const CompanyPerfilController = require('../controllers/companyPerfilController');
const { verifyToken, verifyRole } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');


// Obter empresa por ID
router.get('/:id', CompanyController.getCompanyById);

// Atualizar informações do perfil da empresa
router.put('/:id', verifyToken, CompanyController.updateCompany);

// Upload de foto de perfil para empresa
router.post('/:id/profile-photo', verifyToken, upload.single('profilePhoto'), CompanyPerfilController.uploadProfilePhoto);

// Eliminar foto de perfil da empresa
router.delete('/:id/profile-photo', verifyToken, CompanyPerfilController.deleteProfilePhoto);

module.exports = router;
