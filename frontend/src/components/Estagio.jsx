import React from "react";
import Logo from "./Logo";
import "../styles/Estagio.css";

function HomePageEstagio({ NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao }) {
    return (
        <div 
            className="container bg-white p-4 rounded shadow mt-5 w-30" 
            style={{ 
                display: "flex", 
                flexDirection: "row", 
                justifyContent: "space-between",
            }}
        >
            <div className="logo-container">
                <Logo width="120" height="120" />
                <div style={{ fontSize: "1.4rem", fontWeight: "500" }}>{NomeEmpresa}</div>
            </div>
            <div className="estagio-container">
                <div style={{ 
                    fontSize: "1.6rem", 
                    fontWeight: "700", 
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
                        <div><span className="estagio-info-label">Ativas: </span> {Ativas}</div>
                        <div><span className="estagio-info-label">Inicio: </span> {Inicio}</div>
                        <div><span className="estagio-info-label">Duração: </span> {Duracao} mês</div>
                    </div>
                </div>
            </div>
            <div className="apply-container">
                <p>{Localizacao}</p>
                <button className="btn btn-primary">Candidatar-me</button>
            </div>
            
        </div>
    )
}
export default HomePageEstagio;