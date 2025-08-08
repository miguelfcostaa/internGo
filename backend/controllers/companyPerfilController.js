const Company = require('../models/Company');
const path = require('path');
const fs = require('fs');

/**
 * CONTROLADOR DE PERFIL DE EMPRESA
 * Gerencia operações de perfil da empresa (fotos, etc.)
 */

class CompanyPerfilController {
    
    /**
     * Upload de foto de perfil da empresa
     */
    static async uploadProfilePhoto(req, res) {
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
                    message: 'Nenhuma imagem foi enviada',
                    suggestion: 'Selecione uma imagem válida para fazer upload'
                });
            }

            // Eliminar a foto anterior se existir
            if (company.profilePhoto) {
                const oldPhotoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', path.basename(company.profilePhoto));
                if (fs.existsSync(oldPhotoPath)) {
                    try {
                        fs.unlinkSync(oldPhotoPath);
                        console.log('Foto anterior eliminada:', oldPhotoPath);
                    } catch (deleteError) {
                        console.warn('Erro ao eliminar foto anterior:', deleteError);
                        // Continuar com o upload mesmo se não conseguir eliminar a foto anterior
                    }
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
                company: {
                    id: updatedCompany._id,
                    name: updatedCompany.name,
                    profilePhoto: updatedCompany.profilePhoto
                }
            });

        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            
            // Eliminar o ficheiro que foi carregado se houve erro
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (cleanupError) {
                    console.error('Erro ao limpar ficheiro após falha:', cleanupError);
                }
            }
            
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor ao fazer upload da foto',
                suggestion: 'Tente novamente com uma imagem válida (JPG, PNG) de tamanho adequado'
            });
        }
    }
    
    /**
     * Eliminar foto de perfil da empresa
     */
    static async deleteProfilePhoto(req, res) {
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
                try {
                    fs.unlinkSync(photoPath);
                    console.log('Foto eliminada com sucesso:', photoPath);
                } catch (deleteError) {
                    console.error('Erro ao eliminar ficheiro físico:', deleteError);
                    // Continuar com a remoção da base de dados mesmo se não conseguir eliminar o ficheiro
                }
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
                company: {
                    id: updatedCompany._id,
                    name: updatedCompany.name,
                    profilePhoto: null
                }
            });

        } catch (error) {
            console.error('Erro ao eliminar foto de perfil:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Erro interno do servidor ao eliminar foto',
                suggestion: 'Tente novamente ou contacte o suporte se o problema persistir'
            });
        }
    }
}

module.exports = CompanyPerfilController;
