import React from "react";
import logo from "../assets/logo.png"; 
import Logo from "../components/Logo";

function HomePageEstagio({ NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao }) {
    return (
        <div className="container bg-white p-4 rounded shadow mt-5" style={{ display: "flex", flexDirection: "row", gap: "100px" }}>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <Logo width="50" height="50" />
                <div>{NomeEmpresa}</div>
            </div>
            <div>
                <h4>{NomeEstagio}</h4>
                <div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div><span style={{fontWeight: "bold" }}>Vagas Total: </span> {TotalVagas}</div>
                        <div><span style={{fontWeight: "bold" }}>Ativas: </span> {Ativas}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div><span style={{fontWeight: "bold" }}>Area: </span> {Area}</div>
                        <div><span style={{fontWeight: "bold" }}>Inicio: </span> {Inicio}</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <div><span style={{fontWeight: "bold" }}>Tipo de Estágio: </span> {TipoEstagio}</div>
                        <div><span style={{fontWeight: "bold" }}>Duração: </span> {Duracao}</div>
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