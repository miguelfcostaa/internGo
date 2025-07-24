import React from "react";
import logo from "../assets/logo.png";

function LogOut() {
    return (
        <div>
            <div>
                <div><img src={logo} alt="logo" className="logo"></img></div>
                <p>tem a certeza que deseja sair da página?</p>
                <p>Ainda tems oportunidades para si!</p>
                <p>Fique mais um pouco e descubra-as.</p>
                <div>
                    <button className="">Continuar a explorar</button> {/*Adicionar funcao para voltar a home page*/}
                    <button className="" >Sair mesmo assim</button>{/*Adicionar funcao para sair*/}
                </div>
            </div>
        </div>
    )
}
export default LogOut;