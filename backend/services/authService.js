const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * SERVIÇO DE AUTENTICAÇÃO
 * Centraliza todas as operações relacionadas com autenticação e JWT
 */

class AuthService {
    
    /**
     * Gerar token JWT para utilizador
     */
    static generateToken(user, role = 'user', expiresIn = '7d') {
        const payload = {
            id: user._id,
            email: user.email,
            role: role
        };

        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    }

    /**
     * Verificar e decodificar token JWT
     */
    static verifyToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Token inválido ou expirado');
        }
    }

    /**
     * Hash de password com bcrypt
     */
    static async hashPassword(password, saltRounds = 12) {
        return await bcrypt.hash(password, saltRounds);
    }

    /**
     * Comparar password com hash
     */
    static async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    /**
     * Extrair token do header Authorization
     */
    static extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7); // Remove "Bearer "
    }

    /**
     * Validar formato de email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Formatar resposta de sucesso para autenticação
     */
    static formatAuthSuccessResponse(user, token, message = 'Autenticação realizada com sucesso') {
        return {
            success: true,
            message,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                cc: user.cc,
                telefone: user.telefone,
                profilePhoto: user.profilePhoto,
                createdAt: user.createdAt
            }
        };
    }

    /**
     * Formatar resposta de erro para autenticação
     */
    static formatAuthErrorResponse(message, statusCode = 400) {
        return {
            success: false,
            message,
            statusCode
        };
    }
}

module.exports = AuthService;
