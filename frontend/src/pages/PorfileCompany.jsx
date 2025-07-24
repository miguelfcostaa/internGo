import React from "react";
import BarraSuperiorUP from "../components/BarraSuperiorUP";
import ButtonMaisDetalhes from "../components/ButtonMaisDetalhes";

function ProfileCompany() {
    return (
        <div>
            <BarraSuperiorUP/>
            <div>
                <div>logo da empresa</div>
                <div>
                    <p>Nome da Empresa</p>
                    <p>Email da Empresa</p>
                </div>
                <ButtonMaisDetalhes onclick={() => {handleClick}}/>{/*Nao sei onde o butao deve levar*/}
            </div>
            <h1>Candidaturas Recebidas</h1>
        </div>
    );
}

export default ProfileCompany;
