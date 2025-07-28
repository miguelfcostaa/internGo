import React, { useState } from "react";
import "../styles/ForgotPassword.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(
          "Email enviado com sucesso! Verifique a sua caixa de entrada."
        );
        setEmail("");
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Erro ao enviar email. Tente novamente.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-wrapper">
      <div className="forgot-container">
        <h2>Envie o seu email</h2>
        <p>
          Por favor insira o email associado com a tua conta para poderes
          recuperar a palavra-passe.
        </p>

        {message && (
          <div className={`message ${isSuccess ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !email}>
            {isLoading ? "Enviando..." : "Enviar email"}
          </button>
        </form>
        <a href="/login">Voltar para o início de sessão</a>
      </div>
    </div>
  );
};

export default PasswordReset;
