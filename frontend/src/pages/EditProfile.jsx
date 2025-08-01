import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ButtonVoltar from "../components/ButtonVoltar"
import profileicon from "../assets/image.png"
import NavBar from "../components/NavBar";
import styles from "../styles/EditProfile.module.css"
import useUser from "../hooks/useUser";

function EditUserProfile() {
    const { id } = useParams();
    const [userInfo, setUserInfo]  = useUser(id);
    const [editMode, setEditMode] = useState(false);
    const [editedUserInfo, setEditedUserInfo] = useState(userInfo);    
    const [fieldErrors, setFieldErrors] = useState({});

    useEffect(() => {
        setEditedUserInfo(userInfo);
    }, [userInfo]);

    const handleChange = (e) => {
        setEditedUserInfo({ ...editedUserInfo, [e.target.name]: e.target.value });
    };

    const formacaoAcademica=[{
        instituicao:"Universidade de Lisboa",
        curso:"Licenciatura em Engenharia Informática",
        anos:"2018-2021",
    },
    {
        instituicao:"Universidade de Lisboa",
        curso:"mestrado em Engenharia Informática",
        anos:"2021-2023",
    }]

    const competenciasTecnicas=[
        "Trabalho em equipa",
        "JavaScript, Python, SQL",   
        "Proatividade, Comunicação",
    ]

    const handleSave = async () => {
        try {
            setFieldErrors({});
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(editedUserInfo),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Perfil atualizado com sucesso:", result);
                setEditMode(false);
                setEditedUserInfo(result);
                setUserInfo(result);
            } else {
                if (result.message && typeof result.message === 'object') {
                    setFieldErrors(result.message);
                } else if (typeof result.message === 'string') {
                    setFieldErrors({ general: result.message });
                } else {
                    setFieldErrors({ general: "Erro desconhecido ao registar." });
                }
            }
        } catch (error) {            
            console.error("Erro ao atualizar perfil:", error);
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
                        <div style={{ position: "relative" }}>
                            <img alt="Imagem de perfil do utilizador" src={profileicon} className={styles.profilePicture} />
                            {editMode && (
                                <div className={styles.profilePictureCircle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div
                            className={styles.buttonEditarPerfil}
                            onClick={editMode ? handleSave : () => setEditMode(true)}
                            style={{ cursor: "pointer" }}
                        >
                            <span>{editMode ? "Guardar" : "Editar Perfil"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" className="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                        </div>
                    </div>
                    <div className={styles.infoContainer}>
                        <div className={styles.infoContainerLeft}>
                            <b>Nome:</b>
                            <p>
                                {editMode ? (
                                    <input
                                        name="name"
                                        value={editedUserInfo.name || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                    />
                                ) : (
                                    userInfo.name
                                )}
                            </p>
                            <b>Idade:</b>
                            <p>
                                {editMode ? (
                                    <input
                                        name="idade"
                                        value={editedUserInfo.idade || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                    />
                                ) : (
                                    userInfo.idade + " anos"
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
                                    />
                                ) : (
                                    userInfo.morada
                                )}
                            </p>
                            <b>Nacionalidade:</b>
                            <p>
                                {editMode ? (
                                    <input
                                        name="nacionalidade"
                                        value={editedUserInfo.nacionalidade || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                    />
                                ) : (
                                    userInfo.nacionalidade
                                )}
                            </p>
                        </div>
                        <div className={styles.infoContainerRight}>
                            <b>Email:</b>
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
                            <b>Aniversário:</b>
                            <p>
                                {editMode ? (
                                    <input
                                      type="text"
                                      name="aniversario"
                                      value={editedUserInfo.aniversario ? editedUserInfo.aniversario.toString().slice(0, 10) : ""}
                                      onChange={handleChange}
                                      className={styles.invisibleInput}
                                      placeholder="YYYY-MM-DD"
                                    />  
                                ) : (
                                    userInfo.aniversario ? userInfo.aniversario.toString().slice(0, 10) : ""
                                )}
                            </p>
                            <b>Nº de telemóvel:</b>
                            <p>
                                {editMode ? (
                                    <input
                                        name="telefone"
                                        value={editedUserInfo.telefone || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                    />
                                ) : (
                                    userInfo.telefone
                                )}
                            </p>
                            <b>Nº de CC:</b>
                            <p>
                                {editMode ? (
                                    <input
                                        name="cc"
                                        value={editedUserInfo.cc || ""}
                                        onChange={handleChange}
                                        className={styles.invisibleInput}
                                    />
                                ) : (
                                    userInfo.cc
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
                            <svg style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </div>
                        <ul style={{fontSize:"1.25rem", textAlign:"left"}}> 
                            {formacaoAcademica.map((element,index)=>(
                                <ul key={index}>
                                    {element.instituicao}
                                    <li style={{marginLeft:"50px"}}>{element.curso}{" ("}{element.anos}{")"}</li>
                                </ul>
                            ))}
                        </ul>
                    </div>
                    <div className={styles.competenciasTecnicas}>
                        <div className={styles.flexRow}>
                            <h3>Competências Técnicas</h3>
                            <svg style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                            </svg>
                        </div>
                        <ul>
                            {competenciasTecnicas.map((element,index)=>(
                            <li key={index} style={{fontSize:"1.25rem", textAlign:"left"}}>
                                {element}
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

export default EditUserProfile;
