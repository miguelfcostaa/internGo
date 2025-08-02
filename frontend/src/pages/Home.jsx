import React, { useEffect, useState } from "react";
import Estagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";
import Filters from "../components/Filters";
import useEstagios from "../hooks/useEstagios";
import { useSearch } from "../contexts/SearchContext";

function Home() {
    const allEstagios = useEstagios();
    const [estagios, setEstagios] = useState(allEstagios);
    const { query, setQuery } = useSearch();
    const [searchTag, setSearchTag] = useState(null);


    useEffect(() => {
        if (query) {
            const filteredEstagios = allEstagios.filter(estagio =>
                estagio.title.toLowerCase().includes(query.toLowerCase()) ||
                estagio.company.name.toLowerCase().includes(query.toLowerCase())
            );
            setEstagios(filteredEstagios);
            setSearchTag(query);
        }

    }, [query, allEstagios]);

    const handleRemoveSearchTag = () => {
        setSearchTag(null);
        setEstagios(allEstagios);
        setQuery('');
    };


    return (
        <>  
            <NavBar />
            <div className={styles.background}>
                <div className={styles.flex}>
                    <Filters 
                        setEstagios={setEstagios} 
                        searchTag={searchTag} 
                        setSearchTag={setSearchTag} 
                        onRemoveSearchTag={handleRemoveSearchTag}
                    />
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
                                    idEstagio={estagio._id}
                                />
                            ))
                        ) : (
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