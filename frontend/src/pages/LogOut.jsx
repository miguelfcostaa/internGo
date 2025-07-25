import React from "react";
import logo from "../assets/logo.png";
import ButtonGeral from "../components/Button/ButtonGeral";
import { useNavigate } from "react-router-dom";

function LogOut() {
    const navigate = useNavigate();
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
                    <ButtonGeral Name={"Continuar a explorar"} className={"BotaoLogout"} /> {/* onClick={() => navigate("/Home")} Adicionar funcao para levar para a pagina de candidatura*/}
                    <ButtonGeral Name={"Sair mesmo assim"} className={"BotaoLogout"} /> {/*} Adicionar funcao para dar logout e levar para a welcomepage*/}
                </div>
            </div>
        </div>
    )
}
export default LogOut;