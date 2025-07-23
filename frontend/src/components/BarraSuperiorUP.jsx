import React from "react";
import logo from "../assets/logo.png";
{/* Barra superior qundo o login foi realizado*/}
function BarraSuperiorUP() {
    return (
        <div className="">
            <div><img src={logo}/></div>
            <div>
                <details>
                    <summary>Nome do utilizador</summary>
                    <p>Logout</p>
                </details>
            </div>
        </div>
    );
}