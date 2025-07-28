import React, { useState } from "react";
import "../styles/ForgotPassword.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email enviado para:", email);
  };

  return (
    <div className="app-wrapper">
      <div className="forgot-container">
        <h2>Envie o seu email</h2>
        <p>
          Por favor insira o email associado com a tua conta para poderes
          recuperar a palavra-passe.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Enviar email</button>
        </form>
        <a href="/login">Voltar para o início de sessão</a>
      </div>
    </div>
  );
};

export default PasswordReset;
