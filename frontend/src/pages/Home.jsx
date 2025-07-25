import React from "react";
import HomePageEstagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import "../styles/Home.css";
import Filters from "../components/Filters";

function HomePage() {
    return (
        <>  
            <NavBar />
            <div className="background">
                <div className="flex">
                    <Filters />
                    <div className="estagios-container">
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Sistemas"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Julho"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Desenvolvimento Web"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Julho"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                        <HomePageEstagio
                            NomeEmpresa="Acin"
                            NomeEstagio="Estágio de Técnico de Redes"
                            TotalVagas={20}
                            Ativas={5}
                            Area="Informática"
                            Inicio="Agosto"
                            TipoEstagio="Renumerado"
                            Duracao="1"
                            Localizacao="Lisboa, Portugal"
                        />
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default HomePage;