const User = require("../models/User");
const validations = require("../utils/validations");
const { deleteProfilePhoto } = require("./perfilController");
const UserService = require("../services/userService");
const path = require("path");
const fs = require("fs");

/**
 * CONTROLADOR DE UTILIZADORES
 * Contém operações CRUD e gestão de perfis de utilizadores
 * Nota: Autenticação (register/login) está no authController.js
 */

// Listar todos os utilizadores
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users.map((user) => UserService.formatUserResponse(user)));
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Obter utilizador por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(UserService.formatUserResponse(user));
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Atualizar utilizador
const updateUser = async (req, res) => {
  try {
    const errors = await validations.validateUserUpdate(User, req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: errors });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Upload de foto de perfil
const uploadProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    // Verificar se o utilizador existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado",
      });
    }

    // Verificar se foi enviado um ficheiro
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhuma imagem foi enviada",
      });
    }

    // Eliminar a foto anterior se existir
    if (user.profilePhoto) {
      const deleteResult = deleteProfilePhoto(user.profilePhoto);
      if (!deleteResult.success) {
        console.warn(
          "Aviso: Não foi possível eliminar a foto anterior:",
          deleteResult.message
        );
      }
    }

    // Atualizar o utilizador com o caminho da nova foto
    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: photoUrl },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Foto de perfil atualizada com sucesso",
      profilePhoto: photoUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao fazer upload da foto de perfil:", error);

    // Eliminar o ficheiro se ocorreu um erro
    if (req.file) {
      const filePath = req.file.path;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Eliminar foto de perfil
const deleteUserProfilePhoto = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilizador não encontrado",
      });
    }

    if (!user.profilePhoto) {
      return res.status(400).json({
        success: false,
        message: "Utilizador não tem foto de perfil",
      });
    }

    // Eliminar o ficheiro do sistema de ficheiros
    const deleteResult = deleteProfilePhoto(user.profilePhoto);
    if (!deleteResult.success) {
      return res.status(500).json({
        success: false,
        message: "Erro ao eliminar o ficheiro da foto de perfil",
        error: deleteResult.error,
      });
    }

    // Atualizar o utilizador removendo a foto
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: null },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Foto de perfil eliminada com sucesso",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erro ao eliminar foto de perfil:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Obter estatísticas de utilizadores (apenas para admins)
const getUserStats = async (req, res) => {
  try {
    const stats = await UserService.getUserStats();
    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

const uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nenhum ficheiro enviado." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { cv: `/uploads/cv/${req.file.filename}` },
      { new: true }
    );

    res.json({ success: true, cvPath: updatedUser.cv });
  } catch (error) {
    console.error("Erro ao carregar CV:", error);
    res.status(500).json({ message: "Erro no upload do CV." });
  }
};

const deleteUserCv = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.cvPath) {
      return res.status(404).json({ message: "CV não encontrado." });
    }

    const fs = require("fs");
    const filePath = path.join(__dirname, "..", user.cvPath);
    fs.unlink(filePath, (err) => {
      if (err) console.error("Erro ao apagar ficheiro:", err);
    });

    user.cvPath = undefined;
    await user.save();

    res.json({ message: "CV apagado com sucesso." });
  } catch (err) {
    res.status(500).json({ message: "Erro ao apagar CV", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  uploadProfilePhoto,
  deleteUserProfilePhoto,
  getUserStats,
  uploadCv,
  deleteUserCv,
};
