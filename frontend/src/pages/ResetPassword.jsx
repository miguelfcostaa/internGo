import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/ResetPassword.module.css";
import ButtonSubmit from "../components/ButtonSubmit";

const PasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setMessage("Token inválido ou expirado");
      setIsSuccess(false);
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setMessage("As palavras-passe não coincidem");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setMessage("A palavra-passe deve ter pelo menos 6 caracteres");
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: formData.password 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage("Palavra-passe redefinida com sucesso! Redirecionando para o login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setIsSuccess(false);
        setMessage(data.message || "Erro ao redefinir palavra-passe. Tente novamente.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Erro de conexão. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={`${styles.appWrapper} page-with-background`}>
        <div className={styles.resetContainer}>
          <h2 className={styles.title}>Link Inválido</h2>
          <p className={styles.description}>
            O link de redefinição é inválido ou expirou.
          </p>
          <a href="/forgot-password" className={styles.backLink}>
            Solicitar novo link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.appWrapper} page-with-background`}>
      <div className={styles.resetContainer}>
        <h2 className={styles.title}>Nova Palavra-passe</h2>
        <p className={styles.description}>
          Digite a sua nova palavra-passe
        </p>

        {message && (
          <div className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="password" className={styles.label}>Nova Palavra-passe</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="Digite a nova palavra-passe"
            onChange={handleChange}
            required
            disabled={isLoading}
            className={styles.passwordInput}
            minLength={6}
          />

          <label htmlFor="confirmPassword" className={styles.label}>Confirmar Palavra-passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirme a nova palavra-passe"
            onChange={handleChange}
            required
            disabled={isLoading}
            className={styles.passwordInput}
            minLength={6}
          />

          <ButtonSubmit
            text="Redefinir Palavra-passe"
            isSubmitting={isLoading}
            loadingText="Redefinindo..."
            type="submit"
            variant="primary"
            disabled={!formData.password || !formData.confirmPassword}
          />
        </form>
        
        <a href="/login" className={styles.backLink}>Voltar para o login</a>
      </div>
    </div>
  );
};


export default PasswordReset;
