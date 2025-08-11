const Company = require('../models/Company');
const { validatePassword } = require('../utils/validations');
const AuthService = require('../services/authService');
const CompanyService = require('../services/companyService');

/**
 * CONTROLADOR DE EMPRESAS
 * Gerencia operações relacionadas com empresas
 */

class CompanyController {
    
    /**
     * Obter empresa por ID
     */
    static async getCompanyById(req, res) {
        try {
            const company = await Company.findById(req.params.id);
            
            if (!company) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Empresa não encontrada' 
                });
            }
            
            const formattedCompany = CompanyService.formatCompanyResponse(company);
            
            res.json({
                success: true,
                company: formattedCompany
            });
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({ 
                success: false,
                message: 'Erro interno do servidor ao buscar empresa',
                suggestion: 'Tente novamente ou contacte o suporte se o problema persistir'
            });
        }
    }
    
    /**
     * Atualizar informações da empresa
     */
    static async updateCompany(req, res) {
        try {
            const companyId = req.params.id;
            
            // Verificar se a empresa existe
            const existingCompany = await Company.findById(companyId);
            if (!existingCompany) {
                return res.status(404).json({
                    success: false,
                    message: 'Empresa não encontrada'
                });
            }
            
            // Validar dados de atualização
            const validation = CompanyService.validateUpdateData(req.body, companyId);
            if (!validation.isValid) {
                console.log('Validation errors:', validation.errors);
                return res.status(400).json({
                    success: false,
                    message: JSON.stringify(validation.errors).replace(/"/g, '').replace(/\[/g, '').replace(/\]/g, ''),
                    errors: validation.errors
                });
            }
            
            // Verificar duplicatas (excluindo a própria empresa)
            if (req.body.email || req.body.nif || req.body.phone) {
                const duplicateCompany = await CompanyService.findExistingCompany(
                    req.body.email || existingCompany.email,
                    req.body.nif || existingCompany.nif,
                    req.body.phone || existingCompany.phone,
                    companyId
                );
                
                if (duplicateCompany) {
                    return res.status(400).json({
                        success: false,
                        message: 'Já existe uma empresa com estes dados'
                    });
                }
            }
            
            // Sanitizar dados para atualização
            const sanitizedData = CompanyService.sanitizeCompanyData(req.body);
            
            const updatedCompany = await Company.findByIdAndUpdate(
                companyId, 
                sanitizedData, 
                { new: true, runValidators: true }
            );
            
            const formattedCompany = CompanyService.formatCompanyResponse(updatedCompany);
            
            res.json({
                success: true,
                message: 'Empresa atualizada com sucesso',
                company: formattedCompany
            });
        } catch (error) {
            console.error('Erro ao atualizar empresa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor ao atualizar empresa',
                suggestion: 'Verifique os dados e tente novamente'
            });
        }
    }
}

module.exports = CompanyController;
