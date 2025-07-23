import React from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../assets/background.jpg";
import logo from "../assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";

function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="container-fluid vh-100 d-flex flex-column flex-md-row p-0">
      {/* Lado izquierdo con imagen */}
      <div className="col-md-6 d-none d-md-block p-0">
        <img
          src={welcomeImage}
          alt="Imagem de boas-vindas"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Lado direito com conteúdo */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-white">
        <div className="text-center px-4">
          <img src={logo} alt="Logo InterGo" className="mb-4" style={{ width: "100px" }} />
          <h1 className="fw-bold">Bem-vindo!</h1>
          <p className="mb-4">
            Bem-vindo à plataforma que liga estudantes a empresas: descobre e
            oferece oportunidades de estágio de verão que fazem a diferença.
          </p>
          <button className="btn btn-warning fw-bold px-4" onClick={() => navigate("/select-user")}>
            Vamos a isso!
          </button>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
