
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import styles from "../styles/ListaCandidaturas.module.css";
import ButtonVoltar from "../components/ButtonVoltar";
import useCandidaturasEstagio from "../hooks/useCandidaturasEstagio";

function ListaCandidaturas() {
    const { id } = useParams();
    const candidaturas = useCandidaturasEstagio(id);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
    }, [id]);

    useEffect(() => {
        setLoading(false);
    }, [candidaturas]);

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

    return (
        <>
            <NavBar />
            <div className={styles.background}>
                <div className={styles.flexColumn}>
                    <div className={styles.flexRow}>
                        <ButtonVoltar />
                        <h2 className={styles.titulo}>Candidaturas Recebidas</h2>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.9rem'}}>
                            <table className="table table-hover shadow align-middle">
                                <thead>
                                    <tr>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Estado</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Nome do Candidato</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Email</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Contacto</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Formação Academica</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Curso</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Competências Técnicas</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">CV</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Ver detalhes</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tablebody}>
                                    {loading ? (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>Carregando candidaturas...</td></tr>
                                    ) : candidaturas.length === 0 ? (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>Nenhuma candidatura recebida.</td></tr>
                                    ) : (
                                        candidaturas.map((candidatura, index) => (
                                            <tr key={candidatura._id || index} className={styles.tablerow}>
                                                <td style={{ backgroundColor: candidatura.status === 'Aceite' ? '#d4edda' : candidatura.status === 'Rejeitada' ? '#f8d7da' : '#fff3cd', padding: "1rem" }}>
                                                    {candidatura.status.charAt(0).toUpperCase() + candidatura.status.slice(1)}
                                                </td>
                                                <td>{candidatura.user.name || <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td>{candidatura.user.email || <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td>{candidatura.user.telefone || <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td>{handleHabilitacoes(candidatura.user.formacaoAcademica) || <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td>{candidatura.user.curso || <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td style={{ maxWidth: '100px' }}>{candidatura.user.competenciasTecnicas && candidatura.user.competenciasTecnicas.length > 0 ? candidatura.user.competenciasTecnicas.join(", ") : <span style={{ color: "#aaa" }}> Não especificado. </span>}</td>
                                                <td>
                                                    {candidatura.cvUrl ? (
                                                        <a href={candidatura.cvUrl} target="_blank" rel="noopener noreferrer">Ver CV</a>
                                                    ) : (
                                                        'Sem CV'
                                                    )}
                                                </td>
                                                <td>
                                                    <Link className={styles.link} to={`/ver-candidatura/${candidatura._id}`}>[ver candidatura]</Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ListaCandidaturas;