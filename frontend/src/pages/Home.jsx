import React, { useEffect, useState } from "react";
import Estagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";
import Filters from "../components/Filters";
import { useSearch } from "../contexts/SearchContext";

function Home() {
    const [allEstagios, setAllEstagios] = useState([]);
    const [estagios, setEstagios] = useState([]);
    const { query, setQuery } = useSearch();
    const [searchTag, setSearchTag] = useState(null);

    // Função para carregar todos os estágios
    const loadAllEstagios = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/estagios', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json();

            if (response.ok) {
                setAllEstagios(data);
                setEstagios(data);
            }
        } catch (error) {
            console.error("Error fetching estagios:", error);
            setAllEstagios([]);
            setEstagios([]);
        }
    };

    useEffect(() => {
        loadAllEstagios();
    }, []);

    useEffect(() => {
        if (query && allEstagios.length > 0) {
            const filteredEstagios = allEstagios.filter(estagio =>
                estagio.title.toLowerCase().includes(query.toLowerCase()) ||
                (estagio.company && estagio.company.name && estagio.company.name.toLowerCase().includes(query.toLowerCase()))
            );
            setEstagios(filteredEstagios);
            setSearchTag(query);
        } else if (!query) {
            setEstagios(allEstagios);
            setSearchTag(null);
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
                                    profilePhoto={estagio.company.profilePhoto}
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