import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import ButtonVoltar from '../components/ButtonVoltar.jsx';
import ProfilePhoto from '../components/ProfilePhoto.jsx';
import styles from '../styles/ProfileEstagiario.module.css';

function ProfileEstagiario() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [currentUser, setCurrentUser] = useState(null);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser({ id: payload.id });
        }
    }, []);

    const isOwnProfile = currentUser && currentUser.id === id;

    useEffect(() => {
        const fetchUserInfo = async () => {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserInfo(data);
                setPreview(data.profilePhoto || '');
            } else console.error("Error fetching user info:", data.message);
        };
        fetchUserInfo();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePhotoSave = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('profilePhoto', selectedFile);

        const response = await fetch(`http://localhost:5000/api/users/${id}/photo`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            setUserInfo(prev => ({ ...prev, profilePhoto: data.photoUrl }));
            setIsPhotoModalOpen(false);
        } else {
            alert('Erro ao atualizar a foto!');
        }
    };

    return (
        <>
            <NavBar/>
            <div className={styles.background}>
                <ButtonVoltar />
                <div className={styles.mainContainer}>
                    <div className={styles.topContainer}>
                        <div className={styles.profilePictureContainer}>
                            <ProfilePhoto 
                                photoUrl={userInfo.profilePhoto}
                                userName={userInfo.name}
                                size="large"
                            />
                            {isOwnProfile && (
                                <div
                                    className={styles.verDetalhesButton}
                                    onClick={() => setIsPhotoModalOpen(true)}
                                    title= "Editar Foto"
                                >
                                </div>
                            )}
                        </div>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoContainerLeft}>
                                <b>Nome:</b>
                                <p>{userInfo.name}</p>
                                <b>Nº de telemóvel:</b>
                                <p>{userInfo.telefone || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Morada:</b>
                                <p>{userInfo.morada || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>NIF:</b>
                                <p>{userInfo.nif || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Universidade:</b>
                                <p>{userInfo.universidade || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                            </div>
                            <div className={styles.infoContainerRight}>
                                <b>Email:</b>
                                <p>{userInfo.email || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Data de nascimento:</b>
                                <p>{userInfo.dataNascimento || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Codigo Postal:</b>
                                <p>{userInfo.codigoPostal || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Nº de CC:</b>
                                <p>{userInfo.cc || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                                <b>Curso:</b>
                                <p>{userInfo.curso || <span style={{ color: "#aaa" }}> Não especificado. </span>}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.bottomContainer}>
                        <div className={styles.formacaoAcademica}>
                            <div className={styles.flexRow}>
                                <h3>Formação Académica</h3>
                            </div>
                            <div style={{ textAlign: "left", padding: "1rem", fontSize: "1.25rem" }}>
                                {userInfo.formacaoAcademica ? (
                                    <div>
                                        { userInfo.formacaoAcademica === "1" ? "Nível 1 - 4º ano do Ensino Básico" :
                                        userInfo.formacaoAcademica === "2" ? "Nível 2 - 6º ano do Ensino Básico" :
                                        userInfo.formacaoAcademica === "3" ? "Nível 3 - 9º ano do Ensino Básico" :
                                        userInfo.formacaoAcademica === "4" ? "Nível 4 - Ensino Secundário + Estágio Profissional" :
                                        userInfo.formacaoAcademica === "5" ? "Nível 5 - Cursos de Especialização Tecnológica (CET)" :
                                        userInfo.formacaoAcademica === "6" ? "Nível 6 - Licenciatura" :
                                        userInfo.formacaoAcademica === "7" ? "Nível 7 - Mestrado" :
                                        userInfo.formacaoAcademica === "8" ? "Nível 8 - Doutoramento" : null}
                                    </div>
                                ) : (
                                    <span style={{ color: "#aaa" }}>Nenhuma formação académica registada.</span>
                                )}
                            </div>
                        </div>
                        <div className={styles.competenciasTecnicas}>
                            <div className={styles.flexRow}>
                                <h3>Competências Técnicas</h3>
                            </div>
                            <ul>
                                {(userInfo.competenciasTecnicas || []).map((competencia, i) => (
                                    <li key={i} style={{ marginLeft: "0.5rem", paddingLeft: "0.5rem", fontSize: "1.25rem" }}>
                                        <span>{competencia}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

 
            {isOwnProfile && isPhotoModalOpen && (
                <div className="modalOverlay">
                    <div className="modalContent">
                        <h2>Foto de Perfil</h2>
                        <div className="previewContainer">
                            {preview ? (
                                <img src={preview} alt="Preview" className="previewImage" />
                            ) : (
                                <div className="placeholder">Nenhuma imagem selecionada</div>
                            )}
                        </div>
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <div className="buttonGroup">
                            <button onClick={handlePhotoSave} className="saveButton">Salvar</button>
                            <button onClick={() => setIsPhotoModalOpen(false)} className="cancelButton">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProfileEstagiario;
