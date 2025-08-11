import React, { useEffect, useState } from "react";
import Estagio from "../components/Estagio";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";
import Filters from "../components/Filters";
import { useSearch } from "../contexts/SearchContext";
import useCandidaturasFeitas from "../hooks/useCandidaturasFeitas";

function Home() {
  const [allEstagios, setAllEstagios] = useState([]);
  const [estagios, setEstagios] = useState([]);
  const { query, setQuery } = useSearch();
  const [searchTag, setSearchTag] = useState(null);

  // Obter informações do usuário logado
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Hook para buscar candidaturas do usuário (se for estudante)
  const candidaturasFeitas = useCandidaturasFeitas(user?._id, userRole);

  // Função para carregar todos os estágios
  const loadAllEstagios = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/estagios", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        setAllEstagios(data);
      }
    } catch (error) {
      console.error("Error fetching estagios:", error);
      setAllEstagios([]);
      setEstagios([]);
    }
  };

  // Função para obter informações do usuário logado
  const getUserInfo = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ _id: payload.id });
        setUserRole(payload.role);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  };

  // Função para filtrar estágios, removendo aqueles já candidatados pelo usuário
  const filterEstagiosAlreadyApplied = (estagiosList) => {
    // Se não for estudante ou não tiver candidaturas, retorna todos os estágios
    if (
      userRole !== "user" ||
      !candidaturasFeitas ||
      candidaturasFeitas.length === 0
    ) {
      return estagiosList;
    }

    // Obter lista de IDs dos estágios já candidatados
    const estagiosJaCandidatados = candidaturasFeitas.map(
      (candidatura) => candidatura.estagio._id
    );

    // Filtrar estágios removendo os já candidatados
    return estagiosList.filter(
      (estagio) => !estagiosJaCandidatados.includes(estagio._id)
    );
  };

  useEffect(() => {
    getUserInfo();
    loadAllEstagios();
  }, []);

  // Effect para aplicar filtro quando candidaturas ou estágios mudarem
  useEffect(() => {
    if (allEstagios.length > 0) {
      const estagiosFiltrados = filterEstagiosAlreadyApplied(allEstagios);
      setEstagios(estagiosFiltrados);
    }
  }, [allEstagios, candidaturasFeitas, userRole]);

  useEffect(() => {
    if (query && allEstagios.length > 0) {
      const filteredEstagios = allEstagios.filter(
        (estagio) =>
          estagio.title.toLowerCase().includes(query.toLowerCase()) ||
          (estagio.company &&
            estagio.company.name &&
            estagio.company.name.toLowerCase().includes(query.toLowerCase()))
      );

      // Aplicar filtro de candidaturas também na busca
      const estagiosFiltrados = filterEstagiosAlreadyApplied(filteredEstagios);
      setEstagios(estagiosFiltrados);
      setSearchTag(query);
    } else if (!query && allEstagios.length > 0) {
      const estagiosFiltrados = filterEstagiosAlreadyApplied(allEstagios);
      setEstagios(estagiosFiltrados);
      setSearchTag(null);
    }
  }, [query, allEstagios, candidaturasFeitas, userRole]);

  const handleRemoveSearchTag = () => {
    setSearchTag(null);
    if (allEstagios.length > 0) {
      const estagiosFiltrados = filterEstagiosAlreadyApplied(allEstagios);
      setEstagios(estagiosFiltrados);
    }
    setQuery("");
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
  );
}

export default Home;
