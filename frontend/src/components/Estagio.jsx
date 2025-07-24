import React from "react";
import Logo from "./Logo";
import "../styles/Estagio.css";

function HomePageEstagio({ NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao }) {
    return (
        <div className="container bg-white p-4 rounded shadow mt-5" style={{ display: "flex", flexDirection: "row", gap: "100px" }}>
            <div className="logo-container">
                <Logo width="100" height="100" />
                <div className="text">{NomeEmpresa}</div>
            </div>
            <div className="estagio-details">
                <div className="title">{NomeEstagio}</div>
                <div>
                    <div className="estagio-info">
                        <div><span className="estagio-info-label">Vagas Total: </span> {TotalVagas}</div>
                        <div><span className="estagio-info-label">Ativas: </span> {Ativas}</div>
                    </div>
                    <div className="estagio-info">
                        <div><span className="estagio-info-label">Area: </span> {Area}</div>
                        <div><span className="estagio-info-label">Inicio: </span> {Inicio}</div>
                    </div>
                    <div className="estagio-info">
                        <div><span className="estagio-info-label">Tipo de Estágio: </span> {TipoEstagio}</div>
                        <div><span className="estagio-info-label">Duração: </span> {Duracao}</div>
                    </div>
                </div>
            </div>
            <div>
                <p>{Localizacao}</p>
                <button className="btn btn-primary">Candidatar-me</button>
            </div>
            
        </div>
    )
}
export default HomePageEstagio;