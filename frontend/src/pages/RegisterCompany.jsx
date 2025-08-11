import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupCompany } from "../services/apiService";
import styles from '../styles/RegisterCompany.module.css';
import ButtonSubmit from "../components/ButtonSubmit";
import PasswordCriteriaTooltip from "../components/PasswordCriteria";  
import { isPasswordCriterionMet } from "../utils/registerUserUtils"; 

function RegisterCompany() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    nif: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  // Handler para atualizar os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await signupCompany(
        formData.name,
        formData.email,
        formData.nif,
        formData.phone,
        formData.password,
        formData.confirmPassword
      );

      setSuccess("Empresa criada com sucesso! Redirecionando para o login...");
      setFormData({
        name: "",
        nif: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    // O apiService.js já formata os erros em uma mensagem detalhada
    setError(err.message || "Erro ao criar conta da empresa. Tente novamente.");
  };

  const renderAlert = (type, message, icon) => (
    <div className={`alert alert-${type} d-flex align-items-center`} role="alert">
      <i className={`bi ${icon} me-2`}></i>
      {message}
    </div>
  );

  return (
    <div className="container-fluid page-with-background" style={{ height: '100vh', position: 'relative' }}>
  <div className={styles.registerContainer}>
    <h2 className={`text-center mb-3 ${styles.titleDark}`}>Registo - Empresa</h2>

    {error && renderAlert("danger", error, "bi-exclamation-triangle-fill")}
    {success && renderAlert("success", success, "bi-check-circle-fill")}

    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Columna Izquierda */}
        <div className="col-md-6">
          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Nome da Empresa</label>
            <input
              type="text"
              name="name"
              className={`form-control ${styles.formControl}`}
              placeholder="Insira o nome da empresa"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Email da empresa</label>
            <input
              type="text"
              name="email"
              className={`form-control ${styles.formControl}`}
              placeholder="exemplo@empresa.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className={`form-label d-flex align-items-center ${styles.formLabel}`}>
              Palavra-passe
              <div
                className={`${styles.infoIcon} ms-2`}
                onClick={() => setShowPasswordCriteria(!showPasswordCriteria)}
                style={{
                  cursor: 'pointer',
                  fontSize: '16px',
                  color: '#007bff',
                  position: 'relative'
                }}
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
              type="password"
              name="password"
              className={`form-control ${styles.formControl}`}
              placeholder="Insira a palavra-passe"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-md-6">
          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Número do NIF</label>
            <input
              type="text"
              name="nif"
              className={`form-control ${styles.formControl}`}
              placeholder="Número de Identificação Fiscal"
              value={formData.nif}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>phone</label>
            <div className={`input-group ${styles.inputGroup}`}>
              <select className={`form-select ${styles.formSelect}`} name="prefix" disabled={loading}>
                <option value="+351">+351</option>
                <option value="+55">+55</option>
                <option value="+1">+1</option>
                <option value="+58">+58</option>
              </select>
              <input
                type="text"
                name="phone"
                className={`form-control ${styles.formControl}`}
                placeholder="9 dígitos (ex: 123456789)"
                maxLength="9"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className={`form-label ${styles.formLabel}`}>Confirmar palavra-passe</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${styles.formControl}`}
              placeholder="Confirme a palavra-passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <ButtonSubmit
        text="Criar Conta"
        isSubmitting={loading}
        loadingText="Criando Conta..."
        type="submit"
        variant="primary"
      />
    </form>

    {/* Link para Login */}
    <div className="text-center mt-3">
      <p className="mb-0">
        Já tens uma conta?{' '}
        <Link to="/login" className={styles.loginLink}>
          Faz o Login
        </Link>
      </p>
    </div>
  </div>
</div>

   
  );
}

export default RegisterCompany;
