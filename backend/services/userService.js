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
        const query = { $or: [] };
        
        // Só adicionar campos à query se estiverem definidos
        if (email) {
            query.$or.push({ email: email.toLowerCase().trim() });
        }
        if (cc) {
            query.$or.push({ cc: cc.trim() });
        }
        if (telefone) {
            query.$or.push({ telefone: telefone.trim() });
        }

        // Se não houver campos para verificar, retorna null
        if (query.$or.length === 0) {
            return null;
        }

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
     * Validar formato de telefone português
     */
    static isValidPhone(phone) {
        const phoneRegex = /^9[1236]\d{7}$/;
        return phoneRegex.test(phone.trim());
    }

    /**
     * Validar NIF português
     */
    static isValidNIF(nif) {
        const nifRegex = /^\d{9}$/;
        return nifRegex.test(nif.trim());
    }

    /**
     * Validar formato do Cartão de Cidadão
     */
    static isValidCC(cc) {
        const ccRegex = /^\d{8}$/;
        return ccRegex.test(cc.trim());
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

    static validateUpdateData(userData, excludeId = null) {
        const { name, email, telefone, dataNascimento, morada, codigoPostal, nif, cc, universidade, curso } = userData;
        const errors = [];

        // Validar campos obrigatórios se fornecidos
        if (name !== undefined) {
            if (!name?.trim()) {
                errors.push("Nome não pode estar vazio.");
            } else if (name.trim().length < 2) {
                errors.push("Nome deve ter pelo menos 2 caracteres.");
            }
        }

        if (email !== undefined) {
            if (!email?.trim()) {
                errors.push("Email não pode estar vazio.");
            } else if (!this.isValidEmail(email)) {
                errors.push("Formato de email inválido.");
            }
        }

        if (telefone !== undefined) {
            if (!telefone?.trim()) {
                errors.push("Telefone não pode estar vazio.");
            } else if (!this.isValidPhone(telefone)) {
                errors.push("Telefone deve ter formato válido (9 dígitos começando por 9).");
            }
        }

        // Validar campos opcionais apenas se fornecidos e não vazios
        if (morada !== undefined && morada?.trim().length > 0 && morada.trim().length < 5) {
            errors.push("Morada deve ter pelo menos 5 caracteres.");
        }

        if (codigoPostal !== undefined && codigoPostal?.trim().length > 0 && !/^\d{4}-\d{3}$/.test(codigoPostal)) {
            errors.push("Código postal deve ter formato XXXX-XXX.");
        }
        
        if (nif !== undefined && nif?.trim().length > 0 && !this.isValidNIF(nif)) {
            errors.push("NIF deve ter exatamente 9 dígitos numéricos.");
        }

        if (cc !== undefined && cc?.trim().length > 0 && !this.isValidCC(cc)) {
            errors.push("Cartão de cidadão deve ter formato válido.");
        }

        // Validar campos universitários
        if (universidade !== undefined && universidade?.trim().length > 0 && universidade.trim().length < 2) {
            errors.push("Nome da universidade deve ter pelo menos 2 caracteres.");
        }

        if (curso !== undefined && curso?.trim().length > 0 && curso.trim().length < 2) {
            errors.push("Nome do curso deve ter pelo menos 2 caracteres.");
        }

        // Validar data de nascimento se fornecida
        if (dataNascimento !== undefined && dataNascimento) {
            const date = new Date(dataNascimento);
            const now = new Date();
            const minAge = 16; // idade mínima assumida
            const maxAge = 100; // idade máxima razoável
            
            if (isNaN(date.getTime())) {
                errors.push("Data de nascimento inválida.");
            } else {
                const age = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
                if (age < minAge || age > maxAge) {
                    errors.push(`Idade deve estar entre ${minAge} e ${maxAge} anos.`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

module.exports = UserService;
