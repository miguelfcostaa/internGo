import React from "react";
import logo from "../assets/logo.png";
import ButtonGeral from "../components/Button/ButtonGeral";

function LogOut() {
    return (
        <div>
            <div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                    <div><img src={logo} alt="logo" className="logo"></img></div>
                    <p style={{ textAlign: "center"}}>tem a certeza que deseja sair da página?</p>
                    <p style={{ textAlign: "center"}}>Ainda tem oportunidades para si!</p>
                    <p style={{ textAlign: "center"}}>Fique mais um pouco e descubra-as.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                    <ButtonGeral Name={"Continuar a explorar"} className={"BotaoLogout"} /> {/*Adicionar funcao para voltar a home page*/}
                    <ButtonGeral Name={"Sair mesmo assim"} className={"BotaoLogout"} /> {/*Adicionar funcao para sair*/}
                </div>
            </div>
        </div>
    )
}
export default LogOut;