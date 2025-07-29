import React from "react";
import '../styles/ButtonGeral.css';

function ButtonGeral({ Name, link }) {
    return (
        <button className="botao-geral" onClick={() => window.location.href = link}>{Name}</button>
    );
}
export default ButtonGeral;
