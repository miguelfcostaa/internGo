import React, { useEffect, useState } from "react";
import Estagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import "../styles/Home.css";
import Filters from "../components/Filters";
import useEstagios from "../hooks/useEstagios";

function HomePage() {

    const estagios = useEstagios("");

    return (
        <>  
            <NavBar />
            <div className="background">
                <div className="flex">
                    <Filters />
                    <div className="estagios-container">
                        {estagios.map((estagio, index) => (
                            <Estagio
                                key={index}
                                NomeEmpresa={estagio.NomeEmpresa}
                                NomeEstagio={estagio.title}
                                TotalVagas={estagio.numeroVagas}
                                Area={estagio.area}
                                Inicio={estagio.dataInicio} 
                                TipoEstagio={estagio.tipoEstagio}
                                Duracao={estagio.duracao}
                                Localizacao={estagio.localizacao}
                            />
                        ))}
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default HomePage;