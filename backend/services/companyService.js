const Company = require('../models/Company');
const { validatePassword } = require('../utils/validations');

/**
 * SERVIÇO DE EMPRESAS
 * Centraliza operações e validações relacionadas com empresas
 */

class CompanyService {
    
    /**
     * Verificar se empresa já existe por email, NIF ou telefone
     */
    static async findExistingCompany(email, nif, phone, excludeId = null) {
        const query = {
            $or: [
                { email: email.toLowerCase().trim() },
                { nif: nif.trim() },
                { phone: phone.trim() }
            ]
        };

        // Excluir a própria empresa em caso de update
        if (excludeId) {
            query._id = { $ne: excludeId };
        }

        return await Company.findOne(query);
    }

    /**
     * Validar campos obrigatórios para registo de empresa
     */
    static validateRegistrationData(companyData) {
        const { name, email, nif, phone, password } = companyData;
        const errors = [];
        
        // Campos obrigatórios
        if (!name?.trim()) errors.push('Nome da empresa é obrigatório');
        if (!email?.trim()) errors.push('Email é obrigatório');
        if (!nif?.trim()) errors.push('NIF é obrigatório');
        if (!phone?.trim()) errors.push('Telefone é obrigatório');
        if (!password?.trim()) errors.push('Password é obrigatória');
        
        // Validar formato do email
        if (email && !this.isValidEmail(email)) {
            errors.push('Formato de email inválido');
        }
        
        // Validar NIF português com algoritmo de verificação
        if (nif && !this.isValidNIF(nif)) {
            errors.push('NIF deve ter exatamente 9 dígitos numéricos');
        }
        
        // Validar telefone português
        if (phone && !this.isValidPhone(phone)) {
            errors.push('Telefone deve ter formato válido (9 dígitos)');
        }
        
        // Validar nome da empresa (mínimo 2 caracteres)
        if (name && name.trim().length < 2) {
            errors.push('Nome da empresa deve ter pelo menos 2 caracteres');
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
     * Validar dados para atualização de empresa
     */
    static validateUpdateData(companyData, excludeId = null) {
        const { name, email, nif, phone, morada, codigoPostal } = companyData;
        const errors = [];
        
        // Validar apenas campos que foram fornecidos (update parcial)
        if (name !== undefined) {
            if (!name?.trim()) {
                errors.push('Nome da empresa não pode estar vazio.');
            } else if (name.trim().length < 2) {
                errors.push('Nome da empresa deve ter pelo menos 2 caracteres.');
            }
        }
        
        if (email !== undefined) {
            if (!email?.trim()) {
                errors.push('Email não pode estar vazio.');
            } else if (!this.isValidEmail(email)) {
                errors.push('Formato de email inválido.');
            }
        }
        
        if (nif !== undefined) {
            if (!nif?.trim()) {
                errors.push('NIF não pode estar vazio.');
            } else if (!this.isValidNIF(nif)) {
                errors.push('NIF deve ter exatamente 9 dígitos numéricos.');
            }
        }
        
        if (phone !== undefined) {
            if (!phone?.trim()) {
                errors.push('Telefone não pode estar vazio.');
            } else if (!this.isValidPhone(phone)) {
                errors.push('Telefone deve ter formato válido (9 dígitos começando por 9).');
            }
        }
        
        // Campos opcionais podem ser vazios
        if (morada !== undefined && morada?.trim().length > 0 && morada.trim().length < 5) {
            errors.push('Morada deve ter pelo menos 5 caracteres.');
        }
        
        if (codigoPostal !== undefined && codigoPostal?.trim().length > 0 && !/^\d{4}-\d{3}$/.test(codigoPostal)) {
            errors.push('Código postal deve ter formato XXXX-XXX.');
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
     * Validar NIF português (9 dígitos numéricos)
     */
    static isValidNIF(nif) {
        // Verificar se tem exatamente 9 dígitos numéricos
        if (!/^\d{9}$/.test(nif)) {
            return false;
        }
        
        // Verificar se não são todos zeros ou números repetidos
        if (/^0{9}$/.test(nif) || /^(\d)\1{8}$/.test(nif)) {
            return false;
        }
        
        return true;
    }

    /**
     * Validar telefone português (9 dígitos, começando por 9)
     */
    static isValidPhone(phone) {
        // Telefone português: 9 dígitos, começando por 9 (9xxxxxxxx)
        return /^9\d{8}$/.test(phone);
    }

    /**
     * Limpar e formatar dados da empresa para criação
     */
    static sanitizeCompanyData(companyData) {
        const { name, email, nif, phone, morada, codigoPostal } = companyData;
        
        return {
            name: name?.trim(),
            email: email?.toLowerCase().trim(),
            nif: nif?.trim(),
            phone: phone?.trim(),
            morada: morada?.trim() || undefined,
            codigoPostal: codigoPostal?.trim() || undefined
        };
    }

    /**
     * Formatar resposta da empresa (sem password)
     */
    static formatCompanyResponse(company) {
        const companyObj = company.toObject ? company.toObject() : company;
        
        // Remover password e outros campos sensíveis
        const { password, resetPasswordToken, resetPasswordExpires, ...safeCompany } = companyObj;
        
        return {
            ...safeCompany,
            role: 'company' // Adicionar role padrão
        };
    }

    /**
     * Verificar se empresa pode ser atualizada
     */
    static canUpdateCompany(companyId, requesterId, requesterRole = 'company') {
        // Admin pode atualizar qualquer empresa
        if (requesterRole === 'admin') {
            return true;
        }
        
        // Empresa só pode atualizar-se a si própria
        return companyId === requesterId;
    }

    /**
     * Obter estatísticas de empresas
     */
    static async getCompanyStats() {
        const totalCompanies = await Company.countDocuments();
        const companiesWithPhotos = await Company.countDocuments({ 
            profilePhoto: { $exists: true, $ne: null } 
        });
        const recentCompanies = await Company.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 dias
        });

        return {
            total: totalCompanies,
            withPhotos: companiesWithPhotos,
            recent: recentCompanies,
            percentageWithPhotos: totalCompanies > 0 ? Math.round((companiesWithPhotos / totalCompanies) * 100) : 0
        };
    }
}

module.exports = CompanyService;
