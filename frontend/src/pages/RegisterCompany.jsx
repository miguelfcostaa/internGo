import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/RegisterCompany.css';
import ButtonSubmit from "../components/ButtonSubmit";


function RegisterCompany() {
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});

    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      nif: formData.get("nif"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword")
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
                <input type="text" name="name" className="form-control" placeholder="Insira o nome da empresa" />
              </div>

              <div className="mb-3">
                <label className="form-label">Email da empresa</label>
                <input type="email" name="email" className="form-control" placeholder="exemplo@empresa.com" />
              </div>

              <div className="mb-3">
                <label className="form-label">Palavra-passe</label>
                <input type="password" name="password" className="form-control" placeholder="9 dígitos (ex: 123456789)" />
              </div>
            </div>

            <div className="form-column">
              <div className="mb-3">
                <label className="form-label">Número do NIF</label>
                <input type="text" name="nif" className="form-control"  placeholder="Número de Identificação Fiscal"  />
              </div>

              <div className="mb-3">
                <label className="form-label">Telefone</label>
                <div className="input-group">
                  <select className="form-select" name="prefix">
                    <option value="+351">+351</option>
                    <option value="+55">+55</option>
                    <option value="+1">+1</option>
                    <option value="+58">+58</option>
                  </select>
                  <input type="text" name="phone" className="form-control" placeholder="9 dígitos (ex: 123456789)" maxLength="9" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirmar palavra-passe</label>
                <input type="password" name="confirmPassword" className="form-control" placeholder="Confirme a palavra-passe" />
              </div>
            </div>
          </div>

          <button type="submit" className="Button-Submiting">
            Criar Conta
          </button>
        </form>

        <p className="mt-3 text-center">
          Já tens uma conta? <a href="/login">Faz o Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterCompany;
