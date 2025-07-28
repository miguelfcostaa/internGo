import React from "react";
import { useNavigate } from "react-router-dom";
import Welcomepage from "../assets/Welcomepage.jpg";
import logo from "../assets/logo.png";
import styles from "../styles/WelcomePage.module.css";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.imageSection}>
        <div className={styles.imageContainer}>
          <img
            src={Welcomepage}
            alt="Imagem de boas-vindas"
            className={styles.desktopImage}
          />
        </div>
      </div>
      <div className={styles.mobileImageSection}>
        <img
          src={Welcomepage}
          alt="Imagem mobile"
          className={styles.mobileImage}
        />
      </div>
      <div className={styles.contentSection}>
        <div className={styles.content}>
          <img src={logo} alt="Logo InterGo" className={styles.logo} />
          <h1 className={styles.title}>Bem-vindo!</h1>
          <p className={styles.text}>
            Bem-vindo à plataforma que liga estudantes a empresas:
            descobre e oferece oportunidades de estágio de verão que
            fazem a diferença.
          </p>
          <button
            className="welcome-button"
            onClick={() => navigate("/home")}
          >
            Vamos a isso!
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
