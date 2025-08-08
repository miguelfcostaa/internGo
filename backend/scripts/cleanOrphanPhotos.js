const fs = require('fs');
const path = require('path');
const User = require('../models/User');

/**
 * Script para limpar fotos de perfil órfãs (que não estão associadas a nenhum utilizador)
 * Execute este script ocasionalmente para manter a pasta uploads limpa
 */
async function cleanOrphanPhotos() {
    try {
        console.log('🧹 Iniciando limpeza de fotos órfãs...');
        
        // Caminho da pasta de fotos de perfil
        const uploadsPath = path.join(__dirname, '..', 'uploads', 'profile-photos');
        
        // Verificar se a pasta existe
        if (!fs.existsSync(uploadsPath)) {
            console.log('📁 Pasta de uploads não encontrada:', uploadsPath);
            return;
        }
        
        // Listar todos os ficheiros na pasta
        const allFiles = fs.readdirSync(uploadsPath);
        console.log(`📸 Encontrados ${allFiles.length} ficheiros na pasta de uploads`);
        
        // Buscar todos os utilizadores que têm fotos de perfil
        const usersWithPhotos = await User.find({ 
            profilePhoto: { $exists: true, $ne: null } 
        }).select('profilePhoto');
        
        console.log(`👥 Encontrados ${usersWithPhotos.length} utilizadores com fotos de perfil`);
        
        // Extrair os nomes dos ficheiros das fotos que estão em uso
        const usedPhotoFiles = usersWithPhotos.map(user => {
            if (user.profilePhoto) {
                return path.basename(user.profilePhoto);
            }
        }).filter(Boolean);
        
        console.log(`🔗 Fotos em uso: ${usedPhotoFiles.length}`);
        
        // Identificar fotos órfãs
        const orphanPhotos = allFiles.filter(file => !usedPhotoFiles.includes(file));
        
        console.log(`🗑️  Fotos órfãs encontradas: ${orphanPhotos.length}`);
        
        if (orphanPhotos.length === 0) {
            console.log('✅ Nenhuma foto órfã encontrada. Pasta está limpa!');
            return;
        }
        
        // Eliminar fotos órfãs
        let deletedCount = 0;
        let errorCount = 0;
        
        for (const photoFile of orphanPhotos) {
            try {
                const filePath = path.join(uploadsPath, photoFile);
                fs.unlinkSync(filePath);
                console.log(`🗑️  Eliminado: ${photoFile}`);
                deletedCount++;
            } catch (error) {
                console.error(`❌ Erro ao eliminar ${photoFile}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(`\n📊 Resumo da limpeza:`);
        console.log(`   • Fotos eliminadas: ${deletedCount}`);
        console.log(`   • Erros: ${errorCount}`);
        console.log(`   • Espaço libertado: ${deletedCount} ficheiros`);
        console.log('✅ Limpeza concluída!');
        
    } catch (error) {
        console.error('❌ Erro durante a limpeza de fotos órfãs:', error);
    }
}

// Executar se este ficheiro for chamado diretamente
if (require.main === module) {
    // Conectar à base de dados se não estiver conectado
    const mongoose = require('mongoose');
    
    if (mongoose.connection.readyState === 0) {
        require('dotenv').config();
        mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interngo')
            .then(() => {
                console.log('🔌 Conectado à base de dados');
                return cleanOrphanPhotos();
            })
            .then(() => {
                mongoose.disconnect();
                console.log('🔌 Desconectado da base de dados');
                process.exit(0);
            })
            .catch(error => {
                console.error('❌ Erro:', error);
                process.exit(1);
            });
    } else {
        cleanOrphanPhotos();
    }
}

module.exports = cleanOrphanPhotos;
