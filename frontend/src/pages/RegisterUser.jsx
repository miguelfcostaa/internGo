import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

function RegisterUser() {
  const [formData, setFormData] = useState({
    nome: "",
    bi: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.bi ||
      !formData.email ||
      !formData.telefone ||
      !formData.senha ||
      !formData.confirmarSenha
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    console.log("Datos enviados:", formData);
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="col-md-6 bg-white p-5 rounded shadow">
        <h2 className="text-center mb-4">Registo - Estagiário</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nome" className="form-label">Nome completo</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              placeholder="Digite seu nome"
              value={formData.nome}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="bi" className="form-label">Número do BI (CC)</label>
            <input
              type="text"
              className="form-control"
              id="bi"
              placeholder="Digite o número do BI"
              value={formData.bi}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telefone" className="form-label">Número de telemóvel</label>
            <input
              type="text"
              className="form-control"
              id="telefone"
              placeholder="Digite o número"
              value={formData.telefone}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="senha" className="form-label">Palavra-passe</label>
            <input
              type="password"
              className="form-control"
              id="senha"
              placeholder="Digite a palavra-passe"
              value={formData.senha}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmarSenha" className="form-label">Confirmar palavra-passe</label>
            <input
              type="password"
              className="form-control"
              id="confirmarSenha"
              placeholder="Confirme a palavra-passe"
              value={formData.confirmarSenha}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Criar Conta</button>
        </form>

        <p className="text-center mt-3">
          Já tens uma conta? <Link to="/login">Faz o Login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterUser;
