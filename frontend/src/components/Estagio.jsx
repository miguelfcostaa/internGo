import React from "react";
import Logo from "./Logo";
import styles from "../styles/Estagio.module.css";

function Estagio({ NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao }) {
    
    const handleCandidatarClick = () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Se não estiver logado, redireciona para login
            window.location.href = '/login';
        } else {
            // Se estiver logado, implementar lógica de candidatura
            // Por agora, pode mostrar um alert ou navegar para página de candidatura
            alert('Funcionalidade de candidatura será implementada aqui!');
        }
    };

    return (
        <div 
            className="container bg-white p-4 rounded shadow" 
            style={{ 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "space-between",
                gap: "7rem",
            }}
        >
            <div className={styles.logoContainer}>
                <Logo width="120" height="120" />
                <div style={{ fontSize: "1.4rem", fontWeight: "500" }}>{NomeEmpresa}</div>
            </div>
            <div className={styles.estagioContainer}>
                <div style={{ 
                    fontSize: "1.4rem", 
                    fontWeight: "700", 
                    textAlign: "left",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "25rem",
                    }}
                >
                    {NomeEstagio}
                </div>
                <div className={styles.estagioInfo}>
                    <div className={styles.estagioInfoLeft}>
                        <div><span className={styles.estagioInfoLabel}>Vagas Total: </span> {TotalVagas}</div>
                        <div><span className={styles.estagioInfoLabel}>Area: </span> {Area}</div>
                        <div><span className={styles.estagioInfoLabel}>Tipo de Estágio: </span> {TipoEstagio}</div>
                    </div>
                    <div className={styles.estagioInfoRight}>
                        <div><span className={styles.estagioInfoLabel}>Inicio: </span> {Inicio}</div>
                        <div><span className={styles.estagioInfoLabel}>Duração: </span> {Duracao} mês</div>
                    </div>
                </div>
            </div>
            <div className={styles.applyContainer}>
                <p>{Localizacao}</p>
                <button className="btn btn-primary" onClick={handleCandidatarClick}>
                    Candidatar-me
                </button>
            </div>
            
        </div>
    )
}
export default Estagio;