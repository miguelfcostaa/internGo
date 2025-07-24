import React from "react";
import logo from "../assets/logo.png"; 
import { NomeEmpresa, NomeEstagio, TotalVagas, Ativas, Area, Inicio, TipoEstagio, Duracao, Localizacao } from "../data/estagioData";
import Logo from "../components/Logo";

function HomePageEstagio() {
    return (
        <div>
            <div>
                <Logo width="100" height="100" />
                <div>{NomeEmpresa}</div>
            </div>
            <h1>{NomeEstagio}</h1>
            <div>
                <table>
                    <tr>
                        <td>{TotalVagas}</td>
                        <td>{Ativas}</td>
                    </tr>
                    <tr>
                        <td>{Area}</td>
                        <td>{Inicio}</td>
                    </tr>   
                    <tr>
                        <td>{TipoEstagio}</td>
                        <td>{Duracao}</td>
                    </tr>
                </table>
                <div>
                    <p>{Localizacao}</p>
                    <button onClick={() => {/*Adicionar funcao que permita levar para pagina de candidatura(ainda nao criada)*/}}>Candidatar-me</button>
                </div>
            </div>
        </div>
    )
}
export default HomePageEstagio;