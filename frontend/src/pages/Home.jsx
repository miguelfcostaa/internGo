import React, { useEffect, useState, useRef } from "react";
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
  const [filtersActive, setFiltersActive] = useState(false); // Flag para controlar se filtros estão ativos

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
  const filterEstagiosAlreadyApplied = (
    estagiosList,
    currentUserRole = userRole,
    currentCandidaturas = candidaturasFeitas
  ) => {
    // Se não for estudante ou não tiver candidaturas, retorna todos os estágios
    if (
      currentUserRole !== "user" ||
      !currentCandidaturas ||
      currentCandidaturas.length === 0
    ) {
      return estagiosList;
    }

    // Obter lista de IDs dos estágios já candidatados
    const estagiosJaCandidatados = currentCandidaturas
      .filter((candidatura) => candidatura.estagio && candidatura.estagio._id)
      .map((candidatura) => candidatura.estagio._id);

    // Filtrar estágios removendo os já candidatados
    const filtered = estagiosList.filter(
      (estagio) => !estagiosJaCandidatados.includes(estagio._id)
    );

    return filtered;
  };

  // Função customizada para setEstagios que sempre aplica o filtro de candidaturas
  const setEstagiosWithFilter = (
    estagiosList,
    fromFilters = false,
    currentUserRole = userRole,
    currentCandidaturas = candidaturasFeitas
  ) => {
    if (fromFilters) {
      setFiltersActive(true);
      // Se vem dos filtros, os estágios já foram filtrados no componente Filters
      setEstagios(estagiosList);
    } else {
      // Se não vem dos filtros, aplicar o filtro de candidaturas aqui
      const filteredEstagios = filterEstagiosAlreadyApplied(
        estagiosList,
        currentUserRole,
        currentCandidaturas
      );
      setEstagios(filteredEstagios);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    loadAllEstagios();
  }, []);

  useEffect(() => {
    if (query && allEstagios.length > 0) {
      // Busca sempre funciona, independente dos filtros
      const filteredEstagios = allEstagios.filter((estagio) => {
        const titleMatch = estagio.title
          .toLowerCase()
          .includes(query.toLowerCase());
        const companyMatch =
          estagio.company &&
          estagio.company.name &&
          estagio.company.name.toLowerCase().includes(query.toLowerCase());
        return titleMatch || companyMatch;
      });
      setEstagiosWithFilter(
        filteredEstagios,
        false,
        userRole,
        candidaturasFeitas
      );
      setSearchTag(query);
      setFiltersActive(false); // Reset filtros quando busca é feita
    } else if (!query && allEstagios.length > 0 && !filtersActive) {
      // SEMPRE aplicar filtro de candidaturas quando não há busca e não há filtros
      setEstagiosWithFilter(allEstagios, false, userRole, candidaturasFeitas);
      setSearchTag(null);
    }
  }, [query, allEstagios, filtersActive, candidaturasFeitas, userRole]);

  // Re-aplicar filtro quando candidaturas ou role do usuário mudarem
  useEffect(() => {
    // SEMPRE aplicar o filtro quando há mudanças nas candidaturas ou userRole
    // e não há busca ativa e não há filtros ativos
    if (!filtersActive && allEstagios.length > 0 && !query) {
      setEstagiosWithFilter(allEstagios, false, userRole, candidaturasFeitas);
    }
  }, [candidaturasFeitas, userRole, filtersActive, allEstagios, query]);

  const handleFiltersChange = (hasActiveFilters) => {
    setFiltersActive(hasActiveFilters);

    // Se os filtros foram removidos, reaplicar estágios com filtro de candidaturas
    if (!hasActiveFilters && allEstagios.length > 0 && !query) {
      setEstagiosWithFilter(allEstagios, false, userRole, candidaturasFeitas);
    }
  };

  const handleRemoveSearchTag = () => {
    setSearchTag(null);
    setQuery("");
    // Não resetar filtros quando remover search tag, apenas limpar a busca
    if (!filtersActive) {
      setEstagiosWithFilter(allEstagios, false, userRole, candidaturasFeitas);
    }
  };

  return (
    <>
      <NavBar />
      <div className={styles.background}>
        <div className={styles.flex}>
          <Filters
            setEstagios={(estagios) => setEstagiosWithFilter(estagios, true)}
            searchTag={searchTag}
            setSearchTag={setSearchTag}
            onRemoveSearchTag={handleRemoveSearchTag}
            onFiltersChange={handleFiltersChange}
            userRole={userRole}
            candidaturasFeitas={candidaturasFeitas}
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
