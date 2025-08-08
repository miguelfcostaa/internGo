const User = require('../models/User');
const { validatePassword } = require('../utils/validations');

/**
 * SERVIÇO DE UTILIZADORES
 * Centraliza operações e validações relacionadas com utilizadores
 */

class UserService {
    
    /**
     * Verificar se utilizador já existe por email, CC ou telefone
     */
    static async findExistingUser(email, cc, telefone, excludeId = null) {
        const query = {
            $or: [
                { email: email.toLowerCase().trim() },
                { cc: cc.trim() },
                { telefone: telefone.trim() }
            ]
        };

        // Excluir o próprio utilizador em caso de update
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return await User.findOne(query);
    }

    /**
     * Validar campos obrigatórios para registo
     */
    static validateRegistrationData(userData) {
        const { name, email, cc, telefone, password } = userData;
        const errors = [];
        
        if (!name?.trim()) errors.push('Nome é obrigatório');
        if (!email?.trim()) errors.push('Email é obrigatório');
        if (!cc?.trim()) errors.push('Cartão de cidadão é obrigatório');
        if (!telefone?.trim()) errors.push('Telefone é obrigatório');
        if (!password?.trim()) errors.push('Password é obrigatória');
        
        // Validar formato do email
        if (email && !this.isValidEmail(email)) {
            errors.push('Formato de email inválido');
        }
        
        // Validar critérios de password usando a função do validations.js
        if (password) {
            const passwordError = validatePassword(password);
            if (passwordError) {
                errors.push(passwordError);
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validar formato de email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Limpar e formatar dados do utilizador para criação
     */
    static sanitizeUserData(userData) {
        const { name, email, cc, telefone } = userData;
        
        return {
            name: name?.trim(),
            email: email?.toLowerCase().trim(),
            cc: cc?.trim(),
            telefone: telefone?.trim()
        };
    }

    /**
     * Formatar resposta do utilizador (sem password)
     */
    static formatUserResponse(user) {
        const userObj = user.toObject ? user.toObject() : user;
        
        // Remover password e outros campos sensíveis
        const { password, resetPasswordToken, resetPasswordExpires, ...safeUser } = userObj;
        
        return {
            ...safeUser,
            role: 'user' // Adicionar role padrão
        };
    }

    /**
     * Verificar se utilizador pode ser atualizado
     */
    static canUpdateUser(userId, requesterId, requesterRole = 'user') {
        // Admin pode atualizar qualquer utilizador
        if (requesterRole === 'admin') {
            return true;
        }
        
        // Utilizador só pode atualizar-se a si próprio
        return userId === requesterId;
    }

    /**
     * Obter estatísticas de utilizadores
     */
    static async getUserStats() {
        const totalUsers = await User.countDocuments();
        const usersWithPhotos = await User.countDocuments({ 
            profilePhoto: { $exists: true, $ne: null } 
        });
        const recentUsers = await User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 dias
        });

        return {
            total: totalUsers,
            withPhotos: usersWithPhotos,
            recent: recentUsers,
            percentageWithPhotos: totalUsers > 0 ? Math.round((usersWithPhotos / totalUsers) * 100) : 0
        };
    }
}

module.exports = UserService;
