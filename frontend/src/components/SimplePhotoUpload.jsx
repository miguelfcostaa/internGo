import React, { useState } from 'react';
import styles from '../styles/EditProfile.module.css';

const SimplePhotoUpload = ({ userId, onPhotoUpdate, onCancel }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validar tipo de ficheiro
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas ficheiros de imagem.');
                return;
            }

            // Validar tamanho (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                alert('O ficheiro é muito grande. O tamanho máximo é 5MB.');
                return;
            }

            uploadPhoto(file);
        }
    };

    const uploadPhoto = async (file) => {
        setUploading(true);
        
        try {
            const formData = new FormData();
            formData.append('profilePhoto', file);

            const response = await fetch(`http://localhost:5000/api/users/${userId}/profile-photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                onPhotoUpdate(data.profilePhoto);
                onCancel(); // Fechar o componente após upload
                alert('Foto de perfil atualizada com sucesso!');
            } else {
                console.error('Erro ao fazer upload:', data.message);
                alert(data.message || 'Erro ao fazer upload da foto');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            alert('Erro ao fazer upload da foto');
        } finally {
            setUploading(false);
        }
    };

    const deletePhoto = async () => {
        if (!window.confirm('Tem certeza que deseja eliminar a foto de perfil?')) {
            return;
        }

        setUploading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}/profile-photo`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                onPhotoUpdate(null);
                onCancel();
                alert('Foto de perfil eliminada com sucesso!');
            } else {
                console.error('Erro ao eliminar foto:', data.message);
                alert(data.message || 'Erro ao eliminar a foto');
            }
        } catch (error) {
            console.error('Erro ao eliminar foto:', error);
            alert('Erro ao eliminar a foto');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={styles.simplePhotoUpload}>
            <div className={styles.uploadOptions}>
                <label className={styles.uploadButton} disabled={uploading}>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileSelect}
                        disabled={uploading}
                        style={{ display: 'none' }}
                    />
                    {uploading ? 'A carregar...' : 'Alterar Foto'}
                </label>
                
                <button 
                    className={styles.deleteButton} 
                    onClick={deletePhoto}
                    disabled={uploading}
                >
                    Eliminar Foto
                </button>
                
                <button 
                    className={styles.cancelButton} 
                    onClick={onCancel}
                    disabled={uploading}
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
};

export default SimplePhotoUpload;
