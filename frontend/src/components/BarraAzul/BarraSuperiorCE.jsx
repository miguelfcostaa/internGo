import React from "react";
import "./BarraSuperiorCE.css";
{/*Barra azul na criação de estágios*/}
function BarraSuperiorCE() {
    return (
        <div className="BarraAzul">
            <div>
                <div className="Componente">Criar Estágio</div>
                <div className="Componente">Gestão de Estágios</div>
                <div className="Componente">Gestão de candidatos</div>
                <div className="Componente">Perfil</div>
                <div className="Componente">Mensagens</div>
            </div>
            <div>
                <div className="Componente">Sair</div>
                <div className="Componente">Ajuda</div>
            </div>
        </div>
    );
}

export default BarraSuperiorCE;
