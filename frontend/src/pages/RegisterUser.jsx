import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PasswordCriteriaTooltip from "../components/PasswordCriteria"; // asegúrate que exista este componente
import ButtonSubmit from "../components/ButtonSubmit"; // botón personalizado, si no tienes puedes usar uno normal
import { isPasswordCriterionMet } from "../utils/registerUserUtils"; // función para validar contraseña
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/RegisterUser.css"; // tu css personalizado

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica (puedes mejorar)
    if (
      !formData.name ||
      !formData.cc ||
      !formData.email ||
      !formData.telefone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Aquí puedes hacer llamada API para crear usuario
    setTimeout(() => {
      setLoading(false);
      setSuccess("Conta criada com sucesso! Redirecionando...");
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
    }, 1500);
  };

  const renderAlert = (type, message, icon) => (
    <div className={`alert alert-${type} d-flex align-items-center`} role="alert">
      <i className={`bi ${icon} me-2`}></i>
      {message}
    </div>
  );

  return (
    <div className="app-wrapper container py-5">
      <div className="register-container">
        <h2 className="title-dark mb-4">Registo - Estagiário</h2>

        {error && renderAlert("danger", error, "bi-exclamation-triangle-fill")}
        {success && renderAlert("success", success, "bi-check-circle-fill")}

        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Columna izquierda */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Nome completo</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Insira o seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label d-flex align-items-center">
                  Palavra-passe
                  <div
                    className="info-icon ms-2"
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
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Insira a palavra-passe"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Columna derecha */}
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Número de identificação Civil (CC)</label>
                <input
                  type="text"
                  name="cc"
                  className="form-control"
                  placeholder="Insira o seu número de identificação Civil"
                  value={formData.cc}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={8}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Número de telemóvel</label>
                <input
                  type="tel"
                  name="telefone"
                  className="form-control"
                  placeholder="9xxxxxxxx"
                  value={formData.telefone}
                  onChange={handleChange}
                  disabled={loading}
                  maxLength={9}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar palavra-passe</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
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
            className="w-100 mt-3"
          />
        </form>

        <p className="mt-3 text-center">
          Já tens uma conta?{" "}
          <Link to="/login" className="login-link">
            Faz o Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterUser;

