import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import ButtonVoltar from '../components/ButtonVoltar.jsx';
import ProfilePhoto from '../components/ProfilePhoto.jsx';
import EditableProfilePhoto from '../components/EditableProfilePhoto.jsx';
import styles from '../styles/ProfileEstagiario.module.css';


function ProfileEstagiario() {
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    
    // Get current logged in user
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser({ id: payload.id });
        }
    }, []);
    
    const isOwnProfile = currentUser && currentUser.id === id; // Verificar se é o próprio perfil

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
            } else {
                console.error("Error fetching user info:", data.message);
            }
        };

        fetchUserInfo();
    }, [id]);

    const handlePhotoUpdate = (newPhotoUrl) => {
        setUserInfo(prev => ({
            ...prev,
            profilePhoto: newPhotoUrl
        }));
    };

    return (
    <>
        <NavBar/>
        <div className={styles.background}>
            <ButtonVoltar />
            <div className={styles.mainContainer}>
                <div className={styles.topContainer}>
                    <div className={styles.profilePictureContainer}>
                        <div style={{ position: "relative" }}>
                            {showDetails && isOwnProfile ? (
                                <EditableProfilePhoto 
                                    userId={id}
                                    currentPhoto={userInfo.profilePhoto}
                                    onPhotoUpdate={handlePhotoUpdate}
                                />
                            ) : (
                                <ProfilePhoto 
                                    photoUrl={userInfo.profilePhoto}
                                    userName={userInfo.name}
                                    size="large"
                                />
                            )}
                        </div>
                        {!showDetails && (
                            <button 
                                className={styles.verDetalhesButton}
                                onClick={() => setShowDetails(true)}
                            >
                                Ver Detalhes
                            </button>
                        )}
                    </div>
                    <div className={styles.infoContainer}>
                        <div className={styles.infoContainerLeft}> 
                            <b>Nome:</b>
                            <p>
                                {userInfo.name}
                            </p>
                            <b>Idade:</b>
                            <p>
                                {userInfo.idade ? userInfo.idade + " anos" : <span style={{ color: "#aaa" }}>Ex: 18</span>}
                            </p>
                            <b>Morada:</b>
                            <p>
                                {userInfo.morada || <span style={{ color: "#aaa" }}>Ex: Rua das Flores, 123</span>}
                            </p>
                            <b>Nacionalidade:</b>
                            <p>
                                {userInfo.nacionalidade || <span style={{ color: "#aaa" }}>Ex: Portuguesa</span>}
                            </p>
                        </div>
                        <div className={styles.infoContainerRight}>
                            <b>Email:</b>
                            <p>
                                {userInfo.email || <span style={{ color: "#aaa" }}>Ex: exemplo@exemplo.com</span>}
                            </p>
                            <b>NIF:</b>
                            <p>
                                {userInfo.nif || <span style={{ color: "#aaa" }}>Ex: 123456789</span>}
                            </p>
                            <b>Nº de telemóvel:</b>
                            <p>
                                {userInfo.telefone || <span style={{ color: "#aaa" }}>9XX-XXX-XXX</span>}
                            </p>
                            <b>Nº de CC:</b>
                            <p>
                                {userInfo.cc || <span style={{ color: "#aaa" }}>Ex: 12345678</span>}
                            </p>
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
                                    userInfo.formacaoAcademica === "8" ? "Nível 8 - Doutoramento" :
                                    null}
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
    </>
    );
}

export default ProfileEstagiario;
