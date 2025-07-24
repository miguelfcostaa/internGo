import React from "react";

function ButtonVoltar() {
    return (
        <button onClick={() => window.history.back()} className="">
            Voltar
        </button>
    );
}

export default ButtonVoltar;
