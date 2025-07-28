import React from "react";
import { useNavigate } from "react-router-dom";
import Welcomepage from "../assets/Welcomepage.jpg";
import logo from "../assets/logo.png";
import "../styles/WelcomePage.css";


function WelcomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0">
        <div className="col-md-6 d-none d-md-block p-0">
          <img
            src={Welcomepage}
            alt="Imagem de boas-vindas"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="d-block d-md-none">
          <img
            src={Welcomepage}
            alt="Imagem mobile"
            className="mobile-welcome-image"
          />
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center welcome-content">
          <div className="text-center px-4">
            <img src={logo} alt="Logo InterGo" className="mb-4 welcome-logo" />
            <h1 className="welcome-title">Bem-vindo!</h1>
            <p className="welcome-text">
              Bem-vindo à plataforma que liga estudantes a empresas:
              descobre e oferece oportunidades de estágio de verão que
              fazem a diferença.
            </p>
            <button
              className="welcome-button"
              onClick={() => navigate("/select-user")}
            >
              Vamos a isso!
            </button>
          </div>
        </div>
      </div>

      <footer />
    </>
  );
}

export default WelcomePage;
