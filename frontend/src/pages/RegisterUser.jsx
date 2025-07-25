import React, { useState } from "react";
import { signupUser } from "../services/apiService";
import ButtonSubmit from "../components/ButtonSubmit";
import { validateForm } from "../utils/registerUserUtils";
import "../styles/RegisterUser.css";

function RegisterUser() {
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

      setSuccess("Conta criada com sucesso! Pode agora fazer login.");
      setFormData({
        name: "",
        cc: "",
        email: "",
        telefone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorData = err.message || "Erro ao criar conta. Tente novamente.";
      setError(errorData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="text-center mb-4 title-dark">Registo - Estagiário</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              {success}
            </div>
          )}

       <form onSubmit={handleSubmit}>
    <div className="row gx-4">
   
    <div className="col-md-6 mb-3">
      <label className="form-label">Nome completo</label>
      <input
        type="text"
        name="name"
        className="form-control"
        value={formData.name}
        onChange={handleChange}
        placeholder="Insira o seu nome completo"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Número do BI (CC)</label>
      <input
        type="text"
        name="cc"
        className="form-control"
        value={formData.cc}
        onChange={handleChange}
        placeholder="8 dígitos (ex: 12345678)"
        maxLength="8"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Email</label>
      <input
        type="email"
        name="email"
        className="form-control"
        value={formData.email}
        onChange={handleChange}
        placeholder="exemplo@email.com"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Número de telemóvel</label>
      <input
        type="tel"
        name="telefone"
        className="form-control"
        value={formData.telefone}
        onChange={handleChange}
        placeholder="9xxxxxxxx"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Palavra-passe</label>
      <input
        type="password"
        name="password"
        className="form-control"
        value={formData.password}
        onChange={handleChange}
        placeholder="Insira a palavra-passe"
      />
    </div>

    <div className="col-md-6 mb-3">
      <label className="form-label">Confirmar palavra-passe</label>
      <input
        type="password"
        name="confirmPassword"
        className="form-control"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirme a palavra-passe"
      />
    </div>
  </div>

  <ButtonSubmit
    text="Criar Conta"
    isSubmitting={loading}
    loadingText="Criar Conta..."
    type="submit"
    variant="primary"
  />
</form>


          <p className="mt-3 text-center">
            Já tens uma conta?{" "}
            <a href="/login" className="login-link">
              Faz o Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
