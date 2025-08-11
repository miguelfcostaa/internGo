import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/ResetPassword.module.css";
import ButtonSubmit from "../components/ButtonSubmit";
import PasswordCriteriaTooltip from "../components/PasswordCriteria"; 
import { isPasswordCriterionMet } from "../utils/registerUserUtils";
import { validateRequired, validatePassword, validatePasswordMatch } from "../utils/validationUtils";

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
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  

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

    // Validação de campos obrigatórios
    const passwordValidation = validateRequired(formData.password, "Nova palavra-passe");
    if (!passwordValidation.isValid) {
      setMessage(passwordValidation.message);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    const confirmPasswordValidation = validateRequired(formData.confirmPassword, "Confirmação de palavra-passe");
    if (!confirmPasswordValidation.isValid) {
      setMessage(confirmPasswordValidation.message);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    // Validação de coincidência
    const passwordMatchValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!passwordMatchValidation.isValid) {
      setMessage(passwordMatchValidation.message);
      setIsSuccess(false);
      setIsLoading(false);
      return;
    }

    // Validação completa da senha
    const passwordStrengthValidation = validatePassword(formData.password);
    if (!passwordStrengthValidation.isValid) {
      setMessage(passwordStrengthValidation.message);
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
          <label htmlFor="password" className={`${styles.label} d-flex align-items-center`}>
            Nova Palavra-passe
            <div
              className={`${styles.infoIcon} ms-2`}
              onClick={() => setShowPasswordCriteria(!showPasswordCriteria)}
              style={{ cursor: "pointer", fontSize: "16px", color: "#007bff", position: "relative" }}
            >
              ⓘ
              <PasswordCriteriaTooltip
                password={formData.password}
                isVisible={showPasswordCriteria}
                isPasswordCriterionMet={isPasswordCriterionMet}
              />
            </div>
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            placeholder="Digite a nova palavra-passe"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.passwordInput}
          />
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`${showPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.passwordToggleIcon}`}
            role="button"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') setShowPassword(!showPassword) }}
          ></i>

          <label htmlFor="confirmPassword" className={styles.label}>Confirmar Palavra-passe</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            placeholder="Confirme a nova palavra-passe"
            onChange={handleChange}
            disabled={isLoading}
            className={styles.passwordInput}
          />
          <i
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`${showConfirmPassword ? "bi bi-eye-slash" : "bi bi-eye"} ${styles.passwordToggleIcon}`}
            role="button"
            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') setShowConfirmPassword(!showConfirmPassword) }}
          ></i>

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
