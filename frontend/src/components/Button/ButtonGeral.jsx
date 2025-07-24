import React from "react";

function ButtonGeral({ Name, onclick , className }) {
    return (
        <button onClick={onclick} className={className}>{Name}</button>
    );
}

export default ButtonGeral;
