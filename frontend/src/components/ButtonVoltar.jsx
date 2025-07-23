import React from "react";
{/*O butão voltar no perfil do utilizador e candidaturas efetuadas*/}
function ButtonVoltar() {
    return (
        <button onClick={() => window.history.back()} className="">
            Voltar
        </button>
    );
}

export default ButtonVoltar;
