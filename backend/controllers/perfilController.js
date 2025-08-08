const path = require('path');
const fs = require('fs');

const deleteProfilePhoto = (photoUrl) => {
    if (!photoUrl) return { success: true, message: 'Nenhuma foto para eliminar' };
    
    try {
        const fileName = path.basename(photoUrl);
        const photoPath = path.join(__dirname, '..', 'uploads', 'profile-photos', fileName);
        
        console.log('Tentando eliminar foto:', photoPath);
        
        if (fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
            console.log('Foto eliminada com sucesso:', fileName);
            return { success: true, message: 'Foto eliminada com sucesso' };
        } else {
            console.log('Ficheiro não encontrado:', photoPath);
            return { success: true, message: 'Ficheiro não encontrado (pode já ter sido eliminado)' };
        }
    } catch (error) {
        console.error('Erro ao eliminar foto:', error);
        return { success: false, message: 'Erro ao eliminar ficheiro', error };
    }
};

exports.deleteProfilePhoto = deleteProfilePhoto;