import React from "react";

function ButtonVoltar({ className }) {
    return (
        <button onClick={() => window.history.back()} className={className}>
            Voltar
        </button>
    );
}

export default ButtonVoltar;
