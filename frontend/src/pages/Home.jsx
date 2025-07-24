import React from "react";
import HomePageEstagio from "../components/Estagio";
import NavBar from "../components/NavBar/NavBar";

function HomePage() {
    return (
        <div>
            <NavBar />
            <HomePageEstagio
                NomeEmpresa="Acin"
                NomeEstagio="Estágio de Técnico de Sistemas"
                TotalVagas={20}
                Ativas={5}
                Area="Informática"
                Inicio="Julho"
                TipoEstagio="Renumerado"
                Duracao="1 mês"
                Localizacao="Lisboa, Portugal"
            />
            <HomePageEstagio
                NomeEmpresa="Acin"
                NomeEstagio="Estágio de Técnico de Sistemas"
                TotalVagas={20}
                Ativas={5}
                Area="Informática"
                Inicio="Julho"
                TipoEstagio="Renumerado"
                Duracao="1 mês"
                Localizacao="Lisboa, Portugal"
            />
            <HomePageEstagio
                NomeEmpresa="Acin"
                NomeEstagio="Estágio de Técnico de Sistemas"
                TotalVagas={20}
                Ativas={5}
                Area="Informática"
                Inicio="Julho"
                TipoEstagio="Renumerado"
                Duracao="1 mês"
                Localizacao="Lisboa, Portugal"
            />
        </div>
    )
}

export default HomePage;