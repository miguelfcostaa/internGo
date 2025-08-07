import React from "react";
import styles from "../styles/ButtonVoltar.module.css"

function ButtonVoltar({ onClick, style }) {
    const handleClick = onClick || (() => window.history.back());
    const iconColor = style?.color || "#273F4F";
    
    return (
        <button onClick={handleClick} className={styles.voltar} style={style}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={iconColor} className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Voltar
        </button>
    );
}

export default ButtonVoltar;
