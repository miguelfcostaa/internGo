import React from "react";
import NavBar from "../components/NavBar";
import ButtonVoltar from "../components/ButtonVoltar";
import Styles from "../styles/PaginaEstagio.module.css";
import acin from "../assets/acin.png";
import { useNavigate } from "react-router-dom";

function PaginaEstagio() {
  const navigate = useNavigate();
  const handleCandidatar = () => {
    navigate("/candidatar-estagio");
  };

  return (
    <div>
      <NavBar />
      <div className={Styles.voltarWrapper}>
        <ButtonVoltar />
      </div>

      <main className={Styles.background}>

        {/* Encabezado */}
        <div className={Styles.headerBox}>
          <div className={Styles.headerContent}></div>
          <div className={Styles.logoTitle}>
            <img src={acin} className={Styles.acin} alt="Logo Empresa" />
            <div className={Styles.titleTexts}>
              <h4 className={Styles.heading}>Acin group</h4>
              <h4 className={Styles.heading}>Estágio Técnico de Sistemas</h4>
            </div>
            <div className={Styles.contactInfo}>
              <strong>Email:</strong> acin.group@email.com 
             </div>

          </div>
          <hr className={Styles.separator} />
        </div>

        {/* Contenido principal (columna izquierda + sidebar) */}
        <div className={Styles.mainContent}>
          {/* Columna izquierda */}
          <div className={Styles.leftColumn}>
            <ul className={Styles.cleanList}>
              <li>
                <strong>Área(s) de Atuação:</strong>
                <p>Tecnologia da Informação / Infraestrutura de Sistemas.</p>
              </li>
              <li>
                <strong>Habilitações Académicas Mínimas:</strong>
                <p>
                  Engenharia Informática, Técnico de Sistemas e Redes,
                  Tecnologias de Informação, Ciência da Computação
                </p>
              </li>
              <li>
                <strong>Competências Técnicas Essenciais:</strong>
                <ul className={Styles.subList}>
                  <li>Conhecimentos básicos de redes (TCP/IP, DHCP, DNS)</li>
                  <li>Familiaridade com sistemas operativos Windows e Linux</li>
                  <li>Capacidade de resolver problemas técnicos</li>
                </ul>
              </li>
              <li>
                <strong>Competências Pessoais (Soft Skills):</strong>
                <ul className={Styles.subList}>
                  <li>Proatividade</li>
                  <li>Boa comunicação e trabalho em equipa</li>
                  <li>Gestão de tempo e organização</li>
                  <li>Responsabilidade e ética profissional</li>
                </ul>
              </li>
              <li>
                <strong>Idiomas:</strong>
                <ul className={Styles.subList}>
                  <li>Português</li>
                  <li>Inglês</li>
                  <li>Espanhol</li>
                  <li>Alemão</li>
                </ul>
              </li>
              <li>
                <strong>Descrição do Estágio:</strong>
                <p>
                  Este estágio visa proporcionar uma experiência prática em
                  ambientes de infraestrutura tecnológica, com foco em
                  instalação, configuração e manutenção de sistemas e redes. O
                  estagiário irá trabalhar em conjunto com a equipa técnica em
                  projetos internos e externos, adquirindo experiência real em
                  operações de TI.
                </p>
              </li>
            </ul>
          </div>

          {/* Sidebar + botón */}
          <div className={Styles.sidebarWrapper}>
            <div className={Styles.sidebar}>
              <p><strong>Prazo da Candidatura:</strong> 10/9/2024</p>
              <p><strong>Local de estágio:</strong> Ribeira Brava, Madeira.</p>
              <p><strong>Ínicio do Estágio:</strong> 1/10/2024</p>
              <p><strong>Duração:</strong> 1 Mês</p>
              <p><strong>Número de Vagas:</strong> 10 vagas disponivéis</p>
              <p><strong>Horário do Estágio:</strong>10h até 16h</p>
              <p><strong>Benefícios oferecidos:</strong> Almoço e Transporte</p>
            </div>
            <button className={Styles.customButton} onClick={handleCandidatar}>
              Candidatar-se
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaEstagio;
