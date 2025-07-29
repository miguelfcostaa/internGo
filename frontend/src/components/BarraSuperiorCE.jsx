import React from "react";
import "../styles/BarraSuperiorCE.css";
import { Link, useNavigate } from "react-router-dom";

function BarraSuperiorCE() {
    const navigate = useNavigate();
    function AbreEstagiosAtivos(){
        navigate("/estagios-ativos")
    }    
    return (
        <div className="Barra-azul">
            <div className="Alinhar">
                <div className="Componente">Criar Estágio</div>
                <div className="Componente" onClick={AbreEstagiosAtivos}>Gestão de Estágios</div>
                <div className="Componente">Gestão de candidatos</div>
                <div className="Componente">Perfil</div>
                <div className="Componente">Mensagens</div>
            </div>
            <div className="direita">
                <div className="Componente">Sair</div>
                <div className="Componente">Ajuda</div>
            </div>
        </div>
    );
}

export default BarraSuperiorCE;
