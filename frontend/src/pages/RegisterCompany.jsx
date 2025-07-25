import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/RegisterCompany.css';
import ButtonSubmit from "../components/ButtonSubmit";
import PasswordCriteriaTooltip from "../components/PasswordCriteria";  // Asegúrate que exista
import { isPasswordCriterionMet } from "../utils/registerUserUtils";   // Reutilizar función si tienes

function RegisterCompany() {
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    nif: "",
    email: "",
    prefix: "+351",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando se cambia algo
    if (Object.keys(fieldErrors).length > 0) {
      setFieldErrors({});
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});

    // Validar passwords aquí si quieres (opcional)

    // Armar data para enviar
    const data = {
      ...formData,
      phone: formData.prefix + formData.phone // concatenar prefix y teléfono
    };

    const response = await fetch("http://localhost:5000/api/companies/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (response.ok) {
      setDone(true);
      setFieldErrors({});
      alert("Empresa registada com sucesso!");
      navigate("/home");
    } else {
      if (result.message && typeof result.message === 'object') {
        setFieldErrors(result.message);
      } else if (typeof result.message === 'string') {
        setFieldErrors({ general: result.message });
      } else {
        setFieldErrors({ general: "Erro desconhecido ao registar." });
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="register-container">
        <h2 className="text-center mb-4 title-dark">Registo - Empresa</h2>

        {done && (
          <div className="alert alert-success text-success">
            Empresa registada com sucesso!
          </div>
        )}

        {Object.keys(fieldErrors).length > 0 && (
          <div className="alert alert-danger">
            <ul className="mb-0">
              {Object.values(fieldErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-column">
              <div className="mb-3">
                <label className="form-label">Nome da Empresa</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Insira o nome da empresa"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email da empresa</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="exemplo@empresa.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3 position-relative">
                <label className="form-label d-flex align-items-center">
                  Palavra-passe
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
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Insira a palavra-passe"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-column">
              <div className="mb-3">
                <label className="form-label">Número do NIF</label>
                <input
                  type="text"
                  name="nif"
                  className="form-control"
                  placeholder="Número de Identificação Fiscal"
                  value={formData.nif}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Telefone</label>
                <div className="input-group">
                  <select
                    className="form-select"
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleChange}
                  >
                    <option value="+351">+351</option>
                    <option value="+55">+55</option>
                    <option value="+1">+1</option>
                    <option value="+58">+58</option>
                  </select>
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    placeholder="9 dígitos (ex: 123456789)"
                    maxLength="9"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
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
                />
              </div>
            </div>
          </div>

          <ButtonSubmit
            text="Criar conta"
            type="submit"
            className="w-100"
          />
        </form>

        <p className="mt-3 text-center">
          Já tens uma conta? <a href="/login">Faz o Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterCompany;
