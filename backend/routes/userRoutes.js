const express = require('express');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/multerConfig');
const userController = require('../controllers/userController');

const router = express.Router();

// Rotas de utilizadores (autenticação está em authRoutes.js)
router.get('/', verifyToken, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', verifyToken, userController.updateUser);

// Rotas de gestão de fotos de perfil
router.post('/:id/profile-photo', verifyToken, upload.single('profilePhoto'), userController.uploadProfilePhoto);
router.delete('/:id/profile-photo', verifyToken, userController.deleteUserProfilePhoto);

module.exports = router;
