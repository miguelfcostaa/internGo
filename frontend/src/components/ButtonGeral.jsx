import React from "react";
import '../styles/ButtonGeral.css';

function ButtonGeral({ Name }) {
    return (
        <button className="botao-geral">{Name}</button>
    );
}
export default ButtonGeral;
