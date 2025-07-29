import React from "react";
import "../styles/BarraSuperiorCE.css";
import { Link, useNavigate } from "react-router-dom";

function BarraSuperiorCE() {
    const navigate = useNavigate();
    function AbreEstagiosAtivos(){
        navigate('/profile/:id/estagios')
    }
    function PerfilCompany(){
        navigate('/profile/:id')
    }     
    return (
        <div className="Barra-azul">
            <div className="Alinhar">
                  <Link to= '/pagina-criacao_estagio' className="Componente">
                    Criar Estágio
                  </Link>
                <div className="Componente">Gestão de Estágios</div>
                <div className="Componente">Gestão de candidatos</div>
                <div className="Componente" onClick={PerfilCompany}>Perfil</div>
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
