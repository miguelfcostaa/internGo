import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/apiService";
import ButtonSubmit from "../components/ButtonSubmit";
import { validateForm, isPasswordCriterionMet } from "../utils/registerUserUtils";
import PasswordCriteriaTooltip from "../components/PasswordCriteria";
import "../styles/RegisterUser.css";

function RegisterUser() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    cc: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      await signupUser(
        formData.name,
        formData.email,
        formData.cc,
        formData.telefone,
        formData.password
      );

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");
      setFormData({
        name: "",
        cc: "",
        email: "",
        telefone: "",
        password: "",
        confirmPassword: "",
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
    if (err.response?.data) {
      const errorData = err.response.data;
      if (errorData.message) {
        setError(errorData.message);
      } else if (errorData.errors) {
        const errorMessages = Object.values(errorData.errors).join(", ");
        setError(errorMessages);
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } else {
      setError("Erro ao criar conta. Verifique sua conexão e tente novamente.");
    }
  };

  const renderAlert = (type, message, icon) => (
    <div className={`alert alert-${type} d-flex align-items-center`} role="alert">
      <i className={`bi ${icon} me-2`}></i>
      {message}
    </div>
  );

  const renderFormFieldCol = (label, name, type = "text", placeholder, extraProps = {}) => (
    <div className="col-md-6 mb-3">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        className="form-control"
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={loading}
        {...extraProps}
      />
    </div>
  );

  const renderPasswordField = (label, name, placeholder) => (
    <div className="col-md-6 mb-3">
      <label className="form-label d-flex align-items-center">
        {label}
        {name === "password" && (
          <div
            className="info-icon ms-2"
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
        )}
      </label>
      <input
        type="password"
        name={name}
        className="form-control"
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={loading}
      />
    </div>
  );

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-9 register-container">
          <h2 className="text-center mb-4 title-dark">Registo - Estagiário</h2>

          {error && renderAlert("danger", error, "bi-exclamation-triangle-fill")}
          {success && renderAlert("success", success, "bi-check-circle-fill")}

          <form onSubmit={handleSubmit}>
            <div className="row gx-4">
              {renderFormFieldCol("Nome completo", "name", "text", "Insira o seu nome completo")}
              {renderFormFieldCol("Número do BI (CC)", "cc", "text", "8 dígitos (ex: 12345678)", { maxLength: "8" })}
              {renderFormFieldCol("Email", "email", "email", "exemplo@email.com")}
              {renderFormFieldCol("Número de telemóvel", "telefone", "tel", "9xxxxxxxx")}
              {renderPasswordField("Palavra-passe", "password", "Insira a palavra-passe")}
              {renderPasswordField("Confirmar palavra-passe", "confirmPassword", "Confirme a palavra-passe")}
            </div>

            <ButtonSubmit
              text="Criar Conta"
              isSubmitting={loading}
              loadingText="Criando Conta..."
              type="submit"
              variant="primary"
              className="w-100"
            />
          </form>

          <div className="text-center mt-4">
            <p className="mb-0">
              Já tens uma conta?{" "}
              <Link to="/login" className="text-decoration-none text-primary fw-semibold">
                Faz o Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
