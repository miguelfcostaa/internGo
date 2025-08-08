
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import style from "../styles/VerCandidatura.module.css";
import { Link, useParams } from "react-router-dom";
import ButtonVoltar from "../components/ButtonVoltar";
import NotFound from "../pages/NotFound404";

function VerCandidatura() {
    const { id } = useParams();
    const [estado, setEstado] = useState("Pendente");
    const [candidatura, setCandidatura] = useState(null);
    console.log("Candidatura:", candidatura);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

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
            const res = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/aceitar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            console.log("Resposta da API ao aceitar candidatura:", res);
            if (!res.ok) {
                setError("Erro ao aceitar candidatura.");
            }
            const data = await res.json();
            setCandidatura(data);
            setSuccess("Candidatura aceita com sucesso!");
            setEstado("Aceite");
        } catch (err) {
            setError("Erro ao aceitar candidatura. ");
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (candidaturaId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/candidaturas/${candidaturaId}/recusar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!res.ok) {
                setError("Erro ao recusar candidatura.");
            }
            const data = await res.json();
            setCandidatura(data);
            setEstado("Recusada");
            setSuccess("Candidatura recusada com sucesso!");
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
                                <div className={style.infoValue}><span>{Array.isArray(candidatura.user.competenciasTecnicas) ? candidatura.user.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</span></div>
                            </div>
                            <div className={style.infoRow}>
                                <div className={style.infoLabel}><span>CV:</span></div>
                                <div className={style.infoValue}><span style={{ color: "#aaa" }}> Não especificado. </span></div>
                            </div>
                        </div>
                    </div>

                </div>
                </div>
                {/* Carta de Apresentação */}
                
                <div className={style.cartaBox}>
                    <h1 className={style.heading}>Carta de Apresentação</h1>
                    <div className={style.cartaBoxInner}>
                        <div className={style.carta} style={{ whiteSpace: "pre-line" }}>{candidatura.user.cartaDeApresentacao}</div>
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
                        <div className={style.flexRow}>
                            <ButtonVoltar style={{ marginTop: "1rem" }} />
                        </div>
                        <div className={style.buttonContainer}>
                            <button className={style.acceptButton} onClick={() => handleAccept(candidatura._id)}>Aceitar Candidatura</button>
                            <button className={style.rejectButton} onClick={() => handleReject(candidatura._id)}>Recusar Candidatura</button>
                        </div>
                    </>
                        
                ) : (estado === "Aceite") ? (
                    <>
                        <div className={style.flexRow}>
                            <ButtonVoltar style={{ marginTop: "1rem" }} />
                        </div>
                        <div className={style.buttonContainer}>
                            <span className={style.accepted} disabled>Candidatura Aceite!</span>
                        </div>
                    </>
                ) : (estado === "Recusada") ? (
                    <>
                        <div className={style.flexRow}>
                            <ButtonVoltar style={{ marginTop: "1rem" }} />
                        </div>
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