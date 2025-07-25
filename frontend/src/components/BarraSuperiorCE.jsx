import React from "react";
import "../styles/BarraSuperiorCE.css";

function BarraSuperiorCE() {
    return (
        <div style={{  backgroundColor: "blue", display: "flex", flexDirection: "row"}}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "20px" }}>
                <div style={{ color: "white"}}>Criar Estágio</div>
                <div style={{ color: "white"}}>Gestão de Estágios</div>
                <div style={{ color: "white"}}>Gestão de candidatos</div>
                <div style={{ color: "white"}}>Perfil</div>
                <div style={{ color: "white"}}>Mensagens</div>
            </div>
            <div style={{ display: "flex", flexDirection: "row", position: "absolute", right: "20px", gap: "20px"}}>
                <div style={{ color: "white"}}>Sair</div>
                <div style={{ color: "white"}}>Ajuda</div>
            </div>
        </div>
    );
}

export default BarraSuperiorCE;
