import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import ButtonVoltar from "../components/ButtonVoltar"
import profileicon from "../assets/profile-icon.png"
import NavBar from "../components/NavBar";
import EditableProfilePhoto from "../components/EditableProfilePhoto";
import styles from "../styles/EditProfile.module.css"
import useUser from "../hooks/useUser";
import { getUserRoleFromToken, getUserIdFromToken } from "../utils/jwtUtils";
import RequiredFieldTooltip from "../components/RequiredFieldTooltip.jsx";


function EditUserProfile() {
    const { id: paramId } = useParams();
    const role = getUserRoleFromToken();
    
    // Use ID from params if available, otherwise get from token (for own profile)
    const id = paramId || getUserIdFromToken();
    
    const [userInfo, setUserInfo, refreshUser]  = useUser(id);
    const [editMode, setEditMode] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState(userInfo);
    const [editedCompanyInfo, setEditedCompanyInfo] = useState(userInfo);  
    const [fieldErrors, setFieldErrors] = useState({});
    const competenciaRefs = useRef([]);

    useEffect(() => {
        setEditedUserInfo(userInfo);
        setEditedCompanyInfo(userInfo);
    }, [userInfo]);

    const handleChange = (e) => {
        setEditedUserInfo({ ...editedUserInfo, [e.target.name]: e.target.value });
    };

    const handleCompanyChange = (e) => {
        setEditedCompanyInfo({ ...editedCompanyInfo, [e.target.name]: e.target.value });
    };

    // Atualize o handleChange para lidar com arrays de competências
    const handleCompetenciaChange = (index, value) => {
        const updatedCompetencias = [...(editedUserInfo.competenciasTecnicas || [])];
        updatedCompetencias[index] = value;
        setEditedUserInfo({
            ...editedUserInfo,
            competenciasTecnicas: updatedCompetencias,
        });
    };

    const handleSave = async () => {
        try {
            setFieldErrors({});
            if ( role === "user" ) {
                const response = await fetch(`http://localhost:5000/api/users/${userInfo._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(editedUserInfo),
                });

                const result = await response.json();

                if (response.ok) {
                    setEditMode(false);
                    setEditedUserInfo(prev => ({ ...prev, ...result }));
                    await refreshUser();
                } else {
                    if (result.message && typeof result.message === 'object') {
                        setFieldErrors(result.message);
                    } else if (typeof result.message === 'string') {
                        setFieldErrors({ general: result.message });
                    } else {
                        setFieldErrors({ general: "Erro desconhecido ao registar." });
                    }
                }
            }
            else if ( role === "company" ) {
                const response = await fetch(`http://localhost:5000/api/companies/${userInfo._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(editedCompanyInfo),
                });

                const result = await response.json();

                if (response.ok) {
                    setEditMode(false);
                    setEditedCompanyInfo(prev => ({ ...prev, ...result }));
                    await refreshUser();
                } else {
                    if (result.message && typeof result.message === 'object') {
                        setFieldErrors(result.message);
                    } else if (typeof result.message === 'string') {
                        setFieldErrors({ general: result.message });
                    } else {
                        setFieldErrors({ general: "Erro desconhecido ao registar." });
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
        }
    };


    const handleAddCompetencia = () => {
        setEditedUserInfo({
            ...editedUserInfo,
            competenciasTecnicas: [...(editedUserInfo.competenciasTecnicas || []), ""],
        });
    }

    const handleKeyDown = (e, i) => {
        const value = e.target.value;
        if ((e.key === "Enter" || e.key === ",") && value) {
            e.preventDefault();
            handleAddCompetencia();
            setTimeout(() => {
                if (competenciaRefs.current[i + 1]) {
                    competenciaRefs.current[i + 1].focus();
                }
            }, 0);
        } else if (e.key === "Backspace" && value === "" && (editedUserInfo.competenciasTecnicas || []).length > 1) {
            e.preventDefault();
            const updated = [...(editedUserInfo.competenciasTecnicas || [])];
            updated.splice(i, 1);
            setEditedUserInfo({
                ...editedUserInfo,
                competenciasTecnicas: updated,
            });
            setTimeout(() => {
                if (competenciaRefs.current[i - 1]) {
                    competenciaRefs.current[i - 1].focus();
                }
            }, 0);
        }
    };

    const handlePhotoUpdate = (newPhotoPath) => {
        setUserInfo(prev => ({
            ...prev,
            profilePhoto: newPhotoPath
        }));
        setEditedUserInfo(prev => ({
            ...prev,
            profilePhoto: newPhotoPath
        }));
    };

    return (
    <>
        <NavBar/>
        <div className={styles.background}>
            <ButtonVoltar />
            { role === "user" && (
                <div className={styles.mainContainer}>
                    <div className={styles.topContainer}>
                        <div className={styles.profilePictureContainer}>
                            <div style={{ position: "relative" }}>
                                {editMode ? (
                                    <EditableProfilePhoto 
                                        userId={id}
                                        currentPhoto={userInfo.profilePhoto}
                                        onPhotoUpdate={handlePhotoUpdate}
                                        isCompany={false}
                                    />
                                ) : (
                                    <img 
                                        alt="Imagem de perfil do utilizador" 
                                        src={userInfo.profilePhoto ? `http://localhost:5000${userInfo.profilePhoto}` : profileicon} 
                                        className={styles.profilePicture} 
                                    />
                                )}
                            </div>
                            <div
                                className={styles.buttonEditarPerfil}
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>{editMode ? "Guardar" : "Editar Perfil"}</span>
                                {editMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoContainerLeft}>
                                <b>Nome: {editMode ? <RequiredFieldTooltip /> : null}</b>
                                <p>
                                    {editMode ? (
                                        <>
                                        <input
                                            name="name"
                                            value={editedUserInfo.name || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                        />
                                        </>
                                    ) : (
                                        userInfo.name
                                    )}
                                </p>
                                <b>Nº de telemóvel: {editMode ? <RequiredFieldTooltip /> : null}</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="telefone"
                                            value={editedUserInfo.telefone || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="9XX-XXX-XXX"
                                        />
                                    ) : (
                                        userInfo.telefone || <span style={{ color: "#aaa" }}>9XX-XXX-XXX</span>
                                    )}
                                </p>
                                <b>Morada:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="morada"
                                            value={editedUserInfo.morada || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: Rua das Flores, 123"
                                        />
                                    ) : (
                                        userInfo.morada || <span style={{ color: "#aaa" }}>Ex: Rua das Flores, 123</span>
                                    )}
                                </p>
                                <b>NIF:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                        type="text"
                                        name="nif"
                                        value={editedUserInfo.nif || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                        placeholder="Ex: 123456789"
                                        />  
                                    ) : (
                                        userInfo.nif || <span style={{ color: "#aaa" }}>Ex: 123456789</span>
                                    )}
                                </p>
                                <b>Universidade:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="universidade"
                                            value={editedUserInfo.universidade || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: Universidade de Lisboa"
                                        />
                                    ) : (
                                        userInfo.universidade || <span style={{ color: "#aaa" }}>Ex: Universidade de Lisboa</span>
                                    )}
                                </p>
                            </div>
                            <div className={styles.infoContainerRight}>
                                <b>Email: {editMode ? <RequiredFieldTooltip /> : null}</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="email"
                                            value={editedUserInfo.email || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                        />
                                    ) : (
                                        userInfo.email
                                    )}
                                </p>
                                <b>Data de Nascimento:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="dataNascimento"
                                            value={editedUserInfo.dataNascimento ? editedUserInfo.dataNascimento.slice(0, 10) : ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="AAAA-MM-DD"
                                        />
                                    ) : (
                                        userInfo.dataNascimento ? userInfo.dataNascimento.slice(0, 10) : <span style={{ color: "#aaa" }}>AAAA-MM-DD</span>
                                    )}
                                </p>
                                <b>Codigo Postal:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="codigoPostal"
                                            value={editedUserInfo.codigoPostal || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: 1234-567"
                                        />
                                    ) : (
                                        userInfo.codigoPostal || <span style={{ color: "#aaa" }}>Ex: 1234-567</span>
                                    )}
                                </p>
                                <b>Nº de CC:  {editMode ? <RequiredFieldTooltip /> : null}</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="cc"
                                            value={editedUserInfo.cc || ""}
                                            onChange={handleChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: 12345678"
                                        />
                                    ) : (
                                        userInfo.cc || <span style={{ color: "#aaa" }}>Ex: 12345678</span>
                                    )}
                                </p>
                                <b>Curso:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                        type="text"
                                        name="curso"
                                        value={editedUserInfo.curso || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                        placeholder="Ex: Engenharia Informática"
                                        />  
                                    ) : (
                                        userInfo.curso || <span style={{ color: "#aaa" }}>Ex: Engenharia Informática</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                
                    {Object.keys(fieldErrors).length > 0 && (
                        <div style={{ textAlign: "left" }}>
                            <div className="alert alert-danger" role="alert">
                                <ul className="mb-0">
                                    {Object.values(fieldErrors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                    <div className={styles.bottomContainer}>
                        <div className={styles.formacaoAcademica}>
                            <div className={styles.flexRow}>
                                <h3>Formação Académica</h3>
                            </div>
                            <div style={{ textAlign: "left", padding: "1rem", fontSize: "1.25rem" }}> 
                                {editMode ? (
                                        <select
                                            className={styles.invisibleSelect}
                                            name="formacaoAcademica"
                                            value={editedUserInfo.formacaoAcademica || ""}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecione o nível de habilitação</option>
                                            <option value="1">Nível 1 - 4º ano do Ensino Básico</option>
                                            <option value="2">Nível 2 - 6º ano do Ensino Básico</option>
                                            <option value="3">Nível 3 - 9º ano do Ensino Básico</option>
                                            <option value="4">Nível 4 - Ensino Secundário + Estágio Profissional</option>
                                            <option value="5">Nível 5 - Cursos de Especialização Tecnológica (CET)</option>
                                            <option value="6">Nível 6 - Licenciatura</option>
                                            <option value="7">Nível 7 - Mestrado</option>
                                            <option value="8">Nível 8 - Doutoramento</option>
                                        </select>
                                ) : userInfo.formacaoAcademica ? (
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
                                    <span style={{ color: "#aaa" }}>Nenhuma formação académica registada</span>
                                )}
                            </div>
                        </div>
                        <div className={styles.competenciasTecnicas}>
                            <div className={styles.flexRow}>
                                <h3>Competências Técnicas</h3>
                                {editMode && (
                                    <svg onClick={handleAddCompetencia} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>
                                )}
                            </div>
                            <ul>
                                {(editMode ? editedUserInfo.competenciasTecnicas : userInfo.competenciasTecnicas || []).map((competencia, i) => (
                                    <li key={i} style={{ marginLeft: "0.5rem", paddingLeft: "0.5rem", fontSize: "1.25rem" }}>
                                        {editMode ? (
                                            <input
                                                className={styles.invisibleInputCompetencia}
                                                type="text"
                                                value={competencia}
                                                onChange={e => handleCompetenciaChange(i, e.target.value)}
                                                placeholder="Ex: Trabalho em equipa, JavaScript, Python, SQL"
                                                onKeyDown={e => handleKeyDown(e, i)}
                                                ref={el => competenciaRefs.current[i] = el}
                                            />
                                        ) : (
                                            <span>{competencia}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            {role === "company" && (
                <div className={styles.mainContainer}>
                    <div className={styles.topContainer}>
                        <div className={styles.profilePictureContainer}>
                            <div style={{ position: "relative" }}>
                                {editMode ? (
                                    <EditableProfilePhoto 
                                        userId={id}
                                        currentPhoto={userInfo.profilePhoto}
                                        onPhotoUpdate={handlePhotoUpdate}
                                        isCompany={true}
                                    />
                                ) : (
                                    <img 
                                        alt="Imagem de perfil do utilizador" 
                                        src={userInfo.profilePhoto ? `http://localhost:5000${userInfo.profilePhoto}` : profileicon} 
                                        className={styles.profilePicture} 
                                    />
                                )}
                            </div>
                            <div
                                className={styles.buttonEditarPerfil}
                                onClick={editMode ? handleSave : () => setEditMode(true)}
                                style={{ cursor: "pointer" }}
                            >
                                <span>{editMode ? "Guardar" : "Editar Perfil"}</span>
                                {editMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check2-circle" viewBox="0 0 16 16">
                                        <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0"/>
                                        <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" className="bi bi-pen" viewBox="0 0 16 16">
                                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                        <div className={styles.infoContainer}>
                            <div className={styles.infoContainerLeft}>
                                <b>Nome:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="name"
                                            value={editedCompanyInfo.name || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                        />
                                    ) : (
                                        userInfo.name
                                    )}
                                </p>
                                <b>Morada:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="morada"
                                            value={editedCompanyInfo.morada || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: Rua das Flores, 123"
                                        />
                                    ) : (
                                        userInfo.morada || <span style={{ color: "#aaa" }}>Ex: Rua das Flores, 123</span>
                                    )}
                                </p>
                                <b>Codigo Postal:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="codigoPostal"
                                            value={editedCompanyInfo.codigoPostal || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: 9XXX-XXX"
                                        />
                                    ) : (
                                        userInfo.codigoPostal || <span style={{ color: "#aaa" }}>Ex: 9XXX-XXX</span>
                                    )}
                                </p>
                            </div>
                            <div className={styles.infoContainerRight}>
                                <b>Email:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="email"
                                            value={editedCompanyInfo.email || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                        />
                                    ) : (
                                        userInfo.email
                                    )}
                                </p>
                                <b>Nº de telemóvel:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="phone"
                                            value={editedCompanyInfo.phone || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                            placeholder="9XX-XXX-XXX"
                                        />
                                    ) : (
                                        userInfo.phone || <span style={{ color: "#aaa" }}>9XX-XXX-XXX</span>
                                    )}
                                </p>
                                <b>NIF:</b>
                                <p>
                                    {editMode ? (
                                        <input
                                            name="nif"
                                            value={editedCompanyInfo.nif || ""}
                                            onChange={handleCompanyChange}
                                            className={styles.invisibleInput}
                                            placeholder="Ex: 12345678"
                                        />
                                    ) : (
                                        userInfo.nif || <span style={{ color: "#aaa" }}>Ex: 12345678</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {Object.keys(fieldErrors).length > 0 && (
                        <div style={{ textAlign: "left" }}>
                            <div className="alert alert-danger" role="alert">
                                <ul className="mb-0">
                                    {Object.values(fieldErrors).map((error, index) => (
                                        <li key={index}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    
                </div>
            )}
        </div>
    </>
    );
}

export default EditUserProfile;
