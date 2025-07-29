import React from "react";
import Logo from "./Logo";
import "../styles/Estagio.css";

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
            <div className="logo-container">
                <Logo width="120" height="120" />
                <div style={{ fontSize: "1.4rem", fontWeight: "500" }}>{NomeEmpresa}</div>
            </div>
            <div className="estagio-container">
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
                <div className="estagio-info">
                    <div className="estagio-info-left">
                        <div><span className="estagio-info-label">Vagas Total: </span> {TotalVagas}</div>
                        <div><span className="estagio-info-label">Area: </span> {Area}</div>
                        <div><span className="estagio-info-label">Tipo de Estágio: </span> {TipoEstagio}</div>
                    </div>
                    <div className="estagio-info-right">
                        <div><span className="estagio-info-label">Inicio: </span> {Inicio}</div>
                        <div><span className="estagio-info-label">Duração: </span> {Duracao} mês</div>
                    </div>
                </div>
            </div>
            <div className="apply-container">
                <p>{Localizacao}</p>
                <button className="btn btn-primary" onClick={handleCandidatarClick}>
                    Candidatar-me
                </button>
            </div>
            
        </div>
    )
}
export default Estagio;