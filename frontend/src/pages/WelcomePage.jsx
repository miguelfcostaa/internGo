import React from "react";
import logo from '../assets/logo.png';
function WelcomePage() {
  return (
    <div>

      <div>
        <img src={logo} alt="Logo InterGo" />
        <h1>Bem-vindo!</h1>
        <p>
          Bem-vindo à plataforma que liga estudantes a empresas: descobre e
          oferece oportunidades de estágio de verão que fazem a diferença.
        </p>
        <button>Vamos a isso!</button>
      </div>
    </div>
  );
}
export default WelcomePage;
