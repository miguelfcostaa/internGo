import React from "react";
import NavBar from "../components/NavBar";
import ButtonVoltar from "../components/ButtonVoltar";
import Styles from "../styles/PaginaEstagio.module.css";
import acin from "../assets/acin.png";

function PaginaEstagio() {
  return (
    <div>
      <NavBar />
      
      <div className={Styles.voltarWrapper}>
        <ButtonVoltar />
      </div>

       <main className={`${Styles.background} container py-4`}>
       

   {/* Caja principal: info + sidebar */}
        <div className={`${Styles.bigbox} row`}>
            <div className={`${Styles.headerBox} d-flex align-items-center mb-4`}>
          <img src={acin} className={Styles.acin} alt="Logo Empresa" />
          <div>
            <h4 className={Styles.heading}>Acin group </h4>
            <h4 className={Styles.heading}>Estágio Técnico de Sistemas</h4>
          </div>
        </div>
          <div className="col-md-8">
            <ul className={Styles.list}>
              <li className={Styles.listheading}>
                Área de Atuação: Tecnologia da Informação / Infraestrutura de Sistemas.
                <p className={Styles.description}>
                  Tecnologia da Informação / Infraestrutura de Sistemas.
                </p>
              </li>
              <li className={Styles.listheading}>
                Cursos Preferenciais / Áreas de Estudo:
                <p className={Styles.description}>
                  Engenharia Informática, Técnico de Sistemas e Redes, Tecnologias de Informação, Ciência da Computação
                </p>
              </li>
              <li className={Styles.listheading}>
                Descrição do Estágio:
                <p className={Styles.description}>
                  Este estágio visa proporcionar uma experiência prática em ambientes de infraestrutura tecnológica,
                  com foco em instalação, configuração e manutenção de sistemas e redes.
                  O estagiário irá trabalhar em conjunto com a equipa técnica em projetos internos e externos, 
                  adquirindo experiência real em operações de TI.
                </p>
              </li>
              <li className={Styles.listheading}>
                Competências Técnicas Essenciais:
                <ul className={Styles.description}>
                  <li>Conhecimentos básicos de redes (TCP/IP, DHCP, DNS)</li>
                  <li>Familiaridade com sistemas operativos Windows e Linux</li>
                  <li>Instalação e configuração de software e hardware</li>
                  <li>Noções de segurança da informação</li>
                  <li>Capacidade de resolver problemas técnicos</li>
                </ul>
              </li>
              <li className={Styles.listheading}>
                Competências Pessoais (Soft Skills):
                <ul className={Styles.description}>
                  <li>Proatividade</li>
                  <li>Boa comunicação e trabalho em equipa</li>
                  <li>Capacidade de aprendizagem contínua</li>
                  <li>Gestão de tempo e organização</li>
                  <li>Responsabilidade e ética profissional</li>
                </ul>
              </li>
              <li className={Styles.listheading}>
                Idiomas:
                <ul className={Styles.description}>
                  <li>Português</li>
                  <li>Inglês</li>
                  <li>Espanhol</li>
                  <li>Alemão</li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Sidebar */}
          <div className={`col-md-4 ${Styles.sidebar}`}>
            <p className={Styles.heading}>
              Prazo da Candidatura:
              <span className={Styles.descriptionsidebar}> 10/9/2024</span>
            </p>
            <p className={Styles.heading}>
              Local de estágio:
              <span className={Styles.descriptionsidebar}> Ribeira Brava, Madeira.</span>
            </p>
            <p className={Styles.heading}>
              Ínicio do Estágio:
              <span className={Styles.descriptionsidebar}> 1/10/2024</span>
            </p>
            <p className={Styles.heading}>
              Duração:
              <span className={Styles.descriptionsidebar}> 1 Mês.</span>
            </p>
            <p className={Styles.heading}>
              Número de Vagas:
              <span className={Styles.descriptionsidebar}> 10 vagas disponivéis.</span>
            </p>
            <p className={Styles.heading}>
              Horas de Trabalho:
              <span className={Styles.descriptionsidebar}> 8h diárias, com 1 hora de almoço.</span>
            </p>
            <p className={Styles.heading}>
              Horário:
              <span className={Styles.descriptionsidebar}> 9h-13h | 14h-18h</span>
            </p>
            <p className={Styles.heading}>
              Tipo de Estágio:
              <span className={Styles.descriptionsidebar}> Remunerado</span>
            </p>
            <p className={Styles.heading}>
              Benefícios oferecidos:
              <span className={Styles.descriptionsidebar}> Almoço e Transporte</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PaginaEstagio;
