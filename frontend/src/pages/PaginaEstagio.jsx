import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ButtonVoltar from "../components/ButtonVoltar";
import Styles from "../styles/PaginaEstagio.module.css";
import acin from "../assets/acin.png";
import { useNavigate, useParams } from "react-router-dom";
import useEstagios from "../hooks/useEstagios";
import NotFound from "./NotFound404";

function PaginaEstagio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { estagio, loading } = useEstagios(id);

  // Função para verificar se o usuário é uma empresa
  const isCompany = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role === "company";
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!estagio) {
      console.error("Estágio not found");
      navigate("/not-found");
    }
  }, [estagio, loading, navigate]);

  const handleCandidatar = () => {
    // Verificar se é empresa antes de navegar
    if (isCompany()) {
      alert(
        "Empresas não podem candidatar-se aos estágios. Apenas estudantes podem candidatar-se."
      );
      return;
    }
    navigate("/candidatar-estagio/" + id);
    window.scrollTo(0, 0);
  };

  const handleMesInicio = (mes) => {
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const [ano, mesIndex] = mes.split("-");
    return `${meses[parseInt(mesIndex, 10) - 1]} de ${ano}`;
  };

  const handleHabilitacoes = (habilitacoes) => {
    const habilitacoesMap = {
      1: "Nível 1 - 4º ano do Ensino Básico",
      2: "Nível 2 - 6º ano do Ensino Básico",
      3: "Nível 3 - 9º ano do Ensino Básico",
      4: "Nível 4 - Ensino Secundário + Estágio Profissional",
      5: "Nível 5 - Cursos de Especialização Tecnológica (CET)",
      6: "Nível 6 - Licenciatura",
      7: "Nível 7 - Mestrado",
      8: "Nível 8 - Doutoramento",
    };
    return habilitacoesMap[habilitacoes] || habilitacoes;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!estagio) {
    return <NotFound />;
  }

  return (
    <>
      <NavBar />
      <div
        style={{ marginLeft: "20%", marginTop: "2rem", marginBottom: "1rem" }}
      >
        <ButtonVoltar />
      </div>
      <div className={Styles.background}>
        <div className={Styles.headerBox}>
          <div className={Styles.headerContent}></div>
          <div className={Styles.logoTitle}>
            <img
              src={`http://localhost:5000${estagio.company.profilePhoto}`}
              alt=" "
              width={120}
              height={120}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: "rgb(185, 185, 185, 0.40)",
              }}
            />
            <div className={Styles.titleTexts}>
              <h4 className={Styles.heading}>{estagio.company.name}</h4>
              <h4 className={Styles.heading}>{estagio.title}</h4>
            </div>
            <div className={Styles.contactInfo}>
              <strong>Email:</strong> {estagio.company.email} <br />
              <strong>Contacto:</strong>{" "}
              {estagio.company.phone.replace(
                /(\d{3})(\d{3})(\d{3})/,
                "$1 $2 $3"
              )}{" "}
              <br />
            </div>
          </div>
          <hr className={Styles.separator} />
        </div>

        <div className={Styles.mainContent}>
          <div className={Styles.leftColumn}>
            <ul className={Styles.cleanList}>
              <li>
                <strong>Área(s) de Atuação:</strong>
                <p>
                  {estagio.area.join(", ") || (
                    <span style={{ color: "#888" }}>Não especificado..</span>
                  )}
                </p>
              </li>
              <li>
                <strong>Habilitações Académicas Mínimas:</strong>
                <p>
                  {handleHabilitacoes(estagio.habilitacoesMinimas) || (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </p>
              </li>
              <li>
                <strong>Competências Técnicas Essenciais:</strong>
                <ul className={Styles.subList}>
                  {estagio.competenciasTecnicas ? (
                    estagio.competenciasTecnicas.map((e, index) => (
                      <li key={index}>• {e}</li>
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </ul>
              </li>
              <li>
                <strong>Competências Pessoais (Soft Skills):</strong>
                <ul className={Styles.subList}>
                  {estagio.competenciasPessoais ? (
                    estagio.competenciasPessoais.map((e, index) => (
                      <li key={index}>• {e}</li>
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </ul>
              </li>
              <li>
                <strong>Idiomas:</strong>
                <ul className={Styles.subList}>
                  {estagio.idiomas ? (
                    estagio.idiomas.map((e, index) => (
                      <li key={index}>• {e}</li>
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </ul>
              </li>
              <li>
                <strong>Descrição do Estágio:</strong>
                <p>
                  {estagio.descricao || (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </p>
              </li>
            </ul>
          </div>

          {/* Sidebar
           */}
          <div className={Styles.sidebarWrapper}>
            <div className={Styles.sidebar}>
              <p>
                <strong>Prazo da Candidatura:</strong>{" "}
                {estagio.prazoCandidatura ? (
                  new Date(estagio.prazoCandidatura).toLocaleDateString()
                ) : (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Local de estágio:</strong>{" "}
                {estagio.localizacao || (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Mês de Início do Estágio:</strong>{" "}
                {handleMesInicio(estagio.dataInicio) || (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Duração:</strong>{" "}
                {estagio.duracao ? (
                  estagio.duracao > 1 ? (
                    `${estagio.duracao} Meses`
                  ) : (
                    `${estagio.duracao} Mês`
                  )
                ) : (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Número de Vagas:</strong>{" "}
                {estagio.numeroVagas || (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Horário do Estágio:</strong>{" "}
                {estagio.horaInicio && estagio.horaFim ? (
                  `${estagio.horaInicio} - ${estagio.horaFim}`
                ) : (
                  <span style={{ color: "#888" }}>Não especificado.</span>
                )}
              </p>
              <p>
                <strong>Benefícios oferecidos:</strong>
                <ul className={Styles.subList} style={{ textAlign: "left" }}>
                  {estagio.beneficios.length > 0 ? (
                    estagio.beneficios.map((e, index) => (
                      <li key={index}>• {e}</li>
                    ))
                  ) : (
                    <span style={{ color: "#888" }}>Não especificado.</span>
                  )}
                </ul>
              </p>
            </div>
            {/* Renderizar o botão apenas se o usuário não for uma empresa */}
            {!isCompany() && (
              <button
                className={Styles.customButton}
                onClick={handleCandidatar}
              >
                Candidatar-se
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PaginaEstagio;
