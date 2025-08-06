import React, { useState } from 'react';
import styles from '../styles/EditableProfilePhoto.module.css';
import profilePhoto from '../assets/profile-icon.png';


const EditableProfilePhoto = ({ userId, currentPhoto, onPhotoUpdate, isCompany = false }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handlePhotoUpdate = (newPhotoPath) => {
        onPhotoUpdate(newPhotoPath);
        setShowUploadModal(false);
    };

    const handleCloseModal = () => {
        setShowUploadModal(false);
    };

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

            const apiEndpoint = isCompany 
                ? `http://localhost:5000/api/companies/${userId}/profile-photo`
                : `http://localhost:5000/api/users/${userId}/profile-photo`;

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Ensure we pass the correct photo path
                handlePhotoUpdate(data.profilePhoto);
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
            const apiEndpoint = isCompany 
                ? `http://localhost:5000/api/companies/${userId}/profile-photo`
                : `http://localhost:5000/api/users/${userId}/profile-photo`;

            const response = await fetch(apiEndpoint, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                handlePhotoUpdate(null);
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
        <div className={styles.editablePhotoContainer}>
            <div className={styles.photoDisplay}>
                <img
                    src={currentPhoto ? `http://localhost:5000${currentPhoto}` : profilePhoto}
                    alt="Foto de perfil"
                    className={styles.profileImage}
                />
                <button
                    onClick={() => setShowUploadModal(true)}
                    title={currentPhoto ? "Alterar foto" : "Adicionar foto"}
                    className={styles.addPhotoButton}
                >
                    +
                </button>
            </div>

            {showUploadModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Foto de Perfil</h3>
                            <button
                                className={styles.closeButton}
                                onClick={handleCloseModal}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ marginBottom: '20px' }}>
                                <img
                                    src={currentPhoto ? `http://localhost:5000${currentPhoto}` : profilePhoto}
                                    alt="Foto de perfil"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '3px solid #ddd'
                                    }}
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                  <label className={styles.button} style={{ cursor: uploading ? 'default' : 'pointer' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        disabled={uploading}
                                        style={{ display: 'none' }}
                                    />
                                    {uploading ? 'A carregar...' : (currentPhoto ? 'Alterar Foto' : 'Adicionar Foto')}
                                </label>

                                {currentPhoto && (
                                    <button
                                        onClick={deletePhoto}
                                        disabled={uploading}
                                        className={`${styles.button} ${styles.deleteButton}`}
                                    >
                                        Eliminar Foto
                                    </button>
                                )}

                                <button
                                    onClick={handleCloseModal}
                                    disabled={uploading}
                                    className={`${styles.button} ${styles.primaryButton}`}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditableProfilePhoto;
