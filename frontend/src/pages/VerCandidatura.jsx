
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import style from "../styles/VerCandidatura.module.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import ButtonVoltar from "../components/ButtonVoltar";
import NotFound from "../pages/NotFound404";
import { useCandidaturasContext } from "../contexts/CandidaturasContext";
import { getUserIdFromToken } from "../utils/jwtUtils";

function VerCandidatura() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estado, setEstado] = useState("Pendente");
    const [candidatura, setCandidatura] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const { triggerRefresh } = useCandidaturasContext();

    // Buscar dados da candidatura pelo id
    useEffect(() => {
        async function fetchCandidatura() {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/candidaturas/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
            });
            if (!res.ok) {
            let msg = `Erro ao buscar candidatura (status: ${res.status})`;
            try {
                const errData = await res.json();
                msg += ` - ${errData.message || JSON.stringify(errData)}`;
            } catch {}
            console.error(msg);
            throw new Error(msg);
            }
            const data = await res.json();
            setCandidatura(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        }
        fetchCandidatura();
    }, [id]);


    if (loading) return <div>Carregando...</div>;
    else if (!candidatura) return <NotFound />;


    const handleHabilitacoes = (habilitacoes) => {
        const habilitacoesMap = {
            "1": "Nível 1 - 4º ano do Ensino Básico",
            "2": "Nível 2 - 6º ano do Ensino Básico",
            "3": "Nível 3 - 9º ano do Ensino Básico",
            "4": "Nível 4 - Ensino Secundário + Estágio Profissional",
            "5": "Nível 5 - Cursos de Especialização Tecnológica (CET)",
            "6": "Nível 6 - Licenciatura",
            "7": "Nível 7 - Mestrado",
            "8": "Nível 8 - Doutoramento"
        };
        return habilitacoesMap[habilitacoes] || habilitacoes;
    };

    const handleAccept = async (candidaturaId) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/aceitar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Erro ao aceitar candidatura.");
                return;
            }
            
            setSuccess("Candidatura aceita com sucesso!");
            
            triggerRefresh();
            
            const companyId = getUserIdFromToken();
            if (companyId) {
                navigate(`/profile/${companyId}`);
            } else {
                navigate('/profile');
            }
            
            setEstado("Aceite");
        } catch (err) {
            setError("Erro ao aceitar candidatura.");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (candidaturaId) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/recusar`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    motivo: "Candidatura não adequada aos requisitos da vaga"
                })
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setError(data.message || "Erro ao recusar candidatura.");
                return;
            }
            
            setTimeout(() => {
                setSuccess("Candidatura recusada com sucesso!");
            }, 2000);

            triggerRefresh();
            
            const companyId = getUserIdFromToken();
            if (companyId) {
                navigate(`/profile/${companyId}`);
            } else {
                navigate('/profile');
            }
            
        } catch (err) {
            setError("Erro ao recusar candidatura.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className={style.background}>
                <ButtonVoltar style={{ marginBottom: '0.5rem'}} />
                {error ? (
                    <div className={`alert ${style.alertDanger}`}>
                        <ul className="mb-0">
                            <li>{error}</li>
                        </ul>
                    </div>
                ) : success ? (
                    <div className={`alert ${style.alertSuccess}`}>
                        <ul className="mb-0">
                            <li>{success}</li>
                        </ul>
                    </div>
                ) : null}

                
                {/* Bloco do Estágio */}
                <div className={style.estagioBox}>
                    <div className={style.estagioBoxInner}>
                        <h2 className={style.estagioTitle}>Estágio - {candidatura.estagio.title}</h2>
                        <div className={style.estagioInfoRow}>
                            <div style={{ display: "flex", flexDirection: "column", textAlign: "left", gap: "1rem" }}>
                                <div><b>Área:</b> <span>{Array.isArray(candidatura.estagio.competenciasTecnicas) ? candidatura.estagio.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                                <div><b>Competências Técnicas:</b> <span>{Array.isArray(candidatura.estagio.competenciasTecnicas) ? candidatura.estagio.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", textAlign: "left", gap: "1rem" }}>  
                                <div><b>Habilitações Minimas:</b> <span>{handleHabilitacoes(candidatura.estagio.habilitacoesMinimas) || <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                                <div><b>Idiomas Necessários:</b> <span>{Array.isArray(candidatura.estagio.idiomas) ? candidatura.estagio.idiomas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Informação Pessoal e Formação Acadêmica lado a lado */}
                <div className={style.infoContainer}>
                    {/* Informação Pessoal */}
                    <div className={style.infoBox}>
                        <div className={style.infoBoxInner}>
                            <div className={style.infoHeader}>
                                <h2 className={style.infoTitle}>Informação Pessoal - </h2>
                                <Link to={`/estagiario/${candidatura.user._id}`} className={style.link}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#273F4F" className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                    <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                </svg>
                                </Link>
                            </div>
                            <div className={style.infoContent}>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Candidato:</div>
                                    <div className={style.infoValue}>{candidatura.user.name || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Email:</div>
                                    <div className={style.infoValue}>{candidatura.user.email || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Data de Nascimento:</div>
                                    <div className={style.infoValue}>{candidatura.user.dataNascimento ? candidatura.user.dataNascimento.slice(0, 10) : <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Nº do CC:</div>
                                    <div className={style.infoValue}>{candidatura.user.cc || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>NIF:</div>
                                    <div className={style.infoValue}>{candidatura.user.nif || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Morada:</div>
                                    <div className={style.infoValue}>{candidatura.user.morada || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Código Postal:</div>
                                    <div className={style.infoValue}>{candidatura.user.codigoPostal || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                                </div>
                                <div className={style.infoRow}>
                                    <div className={style.infoLabel}>Nº de Telemóvel:</div>
                                    <div className={style.infoValue}>{candidatura.user.telefone || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>    
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Formação Acadêmica */}
                    <div className={style.infoBox}>
                        <div className={style.infoBoxInner}>
                        <div className={style.infoHeader}>
                            <h2 className={style.infoTitle}>Formação Académica</h2>
                        </div>
                        <div className={style.infoContent}>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>Universidade:</span></div>
                                <div className={style.infoValue}><span>{candidatura.user.universidade || <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>Curso:</span></div>
                                <div className={style.infoValue}><span>{candidatura.user.curso || <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>Formação Acadêmica:</span></div>
                                <div className={style.infoValue}><span>{handleHabilitacoes(candidatura.user.formacaoAcademica) || <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>Competências Técnicas:</span></div>
                                <div className={style.infoValue}><span>{candidatura.competenciasTecnicas.length > 0 ? candidatura.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>CV da Candidatura:</span></div>
                                <div className={style.infoValue}>
                                    {candidatura.cv ? (
                                        <a 
                                            href={`http://localhost:5000/uploads/cv/${candidatura.cv}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={style.downloadLink}
                                            style={{
                                                color: '#273F4F',
                                                textDecoration: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                            onClick={(e) => {
                                                if (!candidatura.cv) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
                                                <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.6 11.6 0 0 0-1.997.406 11.3 11.3 0 0 1-1.021 1.51c-.29.35-.608.655-.926.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8.2 8.2 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 0-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.244.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z"/>
                                            </svg>
                                            Ver CV
                                        </a>
                                    ) : (
                                        <span style={{ color: "#aaa" }}> Não especificado. </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                </div>
                {/* Carta de Apresentação */}
                
                <div className={style.cartaBox}>
                    <h1 className={style.heading}>Carta de Apresentação</h1>
                    <div className={style.cartaBoxInner}>
                        <div className={style.carta} style={{ whiteSpace: "pre-line" }}>{candidatura.cartaApresentacao || <span style={{ color: "#aaa" }}> Não especificado. </span>}</div>
                    </div>
                </div>

                {/* Erro ou Sucesso */}
                <div className={style.errorMessage}>
                    {error ? (
                        <div className={`alert ${style.alertDanger}`}>
                            <ul className="mb-0">
                                <li>{error}</li>
                            </ul>
                        </div>
                    ) : success ? (
                        <div className={`alert ${style.alertSuccess}`}>
                            <ul className="mb-0">
                                <li>{success}</li>
                            </ul>
                        </div>
                    ) : null}
                </div>

                {estado === "Pendente" ? (
                    <>
                        <div className={style.buttonContainer}>
                            <button className={style.acceptButton} onClick={() => handleAccept(candidatura._id)}>Aceitar Candidatura</button>
                            <button className={style.rejectButton} onClick={() => handleReject(candidatura._id)}>Recusar Candidatura</button>
                        </div>
                    </>
                        
                ) : (estado === "Aceite") ? (
                    <>
                        <div className={style.buttonContainer}>
                            <span className={style.accepted} disabled>Candidatura Aceite!</span>
                        </div>
                    </>
                ) : (estado === "Recusada") ? (
                    <>
                        <div className={style.buttonContainer}>
                            <span className={style.rejected} disabled>Candidatura Recusada!</span>
                        </div>
                    </>
                ) : null}

            </div>
        </>
    );
}

export default VerCandidatura;