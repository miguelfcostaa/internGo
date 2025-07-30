import React, { useState } from "react";
import styles from "../styles/ForgotPassword.module.css";
import ButtonSubmit from "../components/ButtonSubmit";

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
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {        
        if (data.emailFound) {
          setIsSuccess(true);
          setMessage("Email enviado com sucesso! Verifique a sua caixa de entrada.");
        } else {
          setIsSuccess(false);
          setMessage("Se o email existir na nossa base de dados, receberá um link de redefinição.");
        }
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
    <div className={`${styles.appWrapper} page-with-background`}>
      <div className={styles.forgotContainer}>
        <h2 className={styles.title}>Envie o seu email</h2>
        <p className={styles.description}>
          Por favor insira o email associado com a tua conta para poderes
          recuperar a palavra-passe.
        </p>

        {message && (
          <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={styles.emailInput}
          />
          <ButtonSubmit
            text="Enviar email"
            isSubmitting={isLoading}
            loadingText="Enviando..."
            type="submit"
            variant="primary"
            disabled={!email}
          />
        </form>
        <a href="/login" className={styles.backLink}>Voltar para o início de sessão</a>
      </div>
    </div>
  );
};

export default PasswordReset;
