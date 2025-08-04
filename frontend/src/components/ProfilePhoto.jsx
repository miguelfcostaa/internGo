import React from 'react';
import styles from '../styles/ProfilePhoto.module.css';

const ProfilePhoto = ({ photoUrl, userName, size = 'medium' }) => {
    const defaultPhoto = '/emptyuser.png';
    const displayPhoto = photoUrl ? `http://localhost:5000${photoUrl}` : defaultPhoto;

    return (
        <div className={`${styles.photoContainer} ${styles[size]}`}>
            <img 
                src={displayPhoto} 
                alt={`Foto de perfil de ${userName || 'utilizador'}`}
                className={styles.profilePhoto}
                onError={(e) => {
                    console.log('Erro ao carregar imagem:', displayPhoto);
                    e.target.src = defaultPhoto;
                }}
            />
        </div>
    );
};

export default ProfilePhoto;
