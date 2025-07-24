import React from "react";

function HomePageEstagio() {
    return (
        <div>
            <div>
                <div>{logo}</div>
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