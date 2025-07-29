import React, { useEffect, useState } from "react";
import Estagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";
import Filters from "../components/Filters";
import useEstagios from "../hooks/useEstagios";

function Home() {

    const [estagios, setEstagios] = useState(useEstagios());

    return (
        <>  
            <NavBar />
            <div className={styles.background}>
                <div className={styles.flex}>
                    <Filters setEstagios={setEstagios} />
                    <div className={styles.estagiosContainer}>
                        {estagios.length > 0 ? (
                            estagios.map((estagio, index) => (
                                <Estagio
                                    key={index}
                                    NomeEmpresa={estagio.company.name}
                                    NomeEstagio={estagio.title}
                                TotalVagas={estagio.numeroVagas}
                                Area={estagio.area}
                                Inicio={estagio.dataInicio} 
                                TipoEstagio={estagio.tipoEstagio}
                                Duracao={estagio.duracao}
                                Localizacao={estagio.localizacao}
                            />
                        ))) : (
                            <div className={styles.noEstagios}>
                                <p>Nenhum estágio corresponde aos filtros aplicados.</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default Home;