import React, { useState, useEffect } from "react";
import styles from "../styles/Filters.module.css";
import remove from "../assets/svgs/remove.svg"; 

const Filters = ({
  setEstagios,
  searchTag,
  setSearchTag,
  onRemoveSearchTag,
  onFiltersChange,
  userRole,
  candidaturasFeitas,
}) => {
  const [filterDefinitions, setFilterDefinitions] = useState([]);
  const [selected, setSelected] = useState({
    area: [],
    localizacao: [],
    duracao: [],
    tipoEstagio: [],
  });

  const [isOpen, setIsOpen] = useState({
    area: false,
    localizacao: false,
    duracao: false,
    tipoEstagio: false,
  });

  const toggleDropdown = (key) => {
    setIsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleValue = (key, value) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const removeFilter = (key, value) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].filter((v) => v !== value),
    }));
  };

  const totalSelected = Object.values(selected).flat().length;

  // Função para filtrar estágios já candidatados (só para users)
  const filterEstagiosAlreadyApplied = (estagiosList) => {
    if (
      userRole !== "user" ||
      !candidaturasFeitas ||
      candidaturasFeitas.length === 0
    ) {
      return estagiosList;
    }

    const estagiosJaCandidatados = candidaturasFeitas
      .filter((candidatura) => candidatura.estagio && candidatura.estagio._id)
      .map((candidatura) => candidatura.estagio._id);

    const filtered = estagiosList.filter(
      (estagio) => !estagiosJaCandidatados.includes(estagio._id)
    );

    return filtered;
  };

  // Função para buscar opções de filtro dinâmicas
  const getFilterOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      // Adicionar token se disponível
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        "http://localhost:5000/api/estagios/filtros/opcoes",
        {
          method: "GET",
          headers: headers,
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Criar array de definições de filtro com dados dinâmicos
        const dynamicFilterDefinitions = [
          {
            key: "area",
            label: "Área",
            options: data.area || [],
          },
          {
            key: "localizacao",
            label: "Localização",
            options: data.localizacao || [],
          },
          {
            key: "duracao",
            label: "Duração",
            options: data.duracao || [],
            format: (value) => `${value} mês(es)`,
          },
          {
            key: "tipoEstagio",
            label: "Tipo de estágio",
            options: data.tipoEstagio || [],
          },
        ];

        setFilterDefinitions(dynamicFilterDefinitions);
      } else {
        console.error(
          "Error response from filter options:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error fetching filter options:", error);
      // Em caso de erro, usar opções estáticas como fallback
      setFilterDefinitions([
        {
          key: "area",
          label: "Área",
          options: [],
        },
        {
          key: "localizacao",
          label: "Localização",
          options: [],
        },
        {
          key: "duracao",
          label: "Duração",
          options: [],
          format: (value) => `${value} mês(es)`,
        },
        {
          key: "tipoEstagio",
          label: "Tipo de estágio",
          options: [],
        },
      ]);
    }
  };

  const getEstagios = async () => {
    try {
      const query = new URLSearchParams();
      Object.entries(selected).forEach(([key, values]) => {
        if (values.length > 0) {
          query.append(key, values.join(","));
        }
      });

      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
      };

      // Adicionar token se disponível
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const url = `http://localhost:5000/api/estagios?${query}`;

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();

      if (response.ok) {
        // Aplicar filtro de candidaturas antes de passar para o pai
        const filteredData = filterEstagiosAlreadyApplied(data);
        setEstagios(filteredData);
      } else {
        console.error("Error response from estagios:", data);
      }
    } catch (error) {
      console.error("Error fetching estagios:", error);
    }
  };

  useEffect(() => {
    getFilterOptions();
  }, []);

  useEffect(() => {
    const hasActiveFilters = Object.values(selected).some(
      (arr) => arr.length > 0
    );

    // Notificar o componente pai sobre mudanças nos filtros
    if (onFiltersChange) {
      onFiltersChange(hasActiveFilters);
    }

    // Só buscar estágios quando há filtros ativos
    // Quando não há filtros, deixar o Home gerenciar
    if (hasActiveFilters) {
      getEstagios();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className={styles.filtrosContainer}>
      <div className={styles.filtrosTags}>
        <p style={{ textAlign: "left", fontSize: "1.4rem" }}>
          Filtro resultados ({totalSelected}):
        </p>
        <div className={styles.tags}>
          {searchTag && (
            <span className={styles.tag}>
              {searchTag}{" "}
              <span className={styles.botao} onClick={onRemoveSearchTag}>
                <img src={remove} alt="Remove" />
              </span>
            </span>
          )}
          {filterDefinitions.map(({ key, format }) =>
            selected[key].map((item, i) => (
              <span key={`${key}-${i}`} className={styles.tag}>
                {format ? format(item) : item} 
                <span
                  className={styles.botao}
                  onClick={() => removeFilter(key, item)}
                >
                  <img src={remove} alt="Remove" />
                </span>
              </span>
            ))
          )}
          {totalSelected === 0 && !searchTag && (
            <span style={{ marginBottom: "0.25rem" }}>
              Nenhum filtro selecionado.
            </span>
          )}
        </div>
      </div>

      {filterDefinitions
        .filter(({ options }) => options && options.length > 0) // Só mostra filtros com opções
        .map(({ key, label, options, format }) => (
          <div key={key} className={styles.filtroCategoria}>
            <button
              className={styles.filtroTitulo}
              onClick={() => toggleDropdown(key)}
            >
              {label}{" "}
              {isOpen[key] ? (
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-caret-up-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-caret-down-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
              )}
            </button>
            {isOpen[key] && (
              <div className={styles.filtroOpcoes}>
                {options.map((option, i) => (
                  <label key={i} className={styles.filtroOpcao}>
                    <input
                      type="checkbox"
                      name={label}
                      style={{ transform: "scale(1.3)", marginRight: "8px" }}
                      checked={selected[key].includes(option)}
                      onChange={() => toggleValue(key, option)}
                    />
                    {format ? format(option) : option}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Filters;
