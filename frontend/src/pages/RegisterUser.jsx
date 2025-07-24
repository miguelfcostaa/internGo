import React, { useState } from "react";
import { signupUser } from "../services/apiService";
import ButtonSubmit from "../components/ButtonSubmit";
import { validateForm } from "../utils/registerUserUtils"; // Importar a função de validação

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
    // Limpar mensagens de erro/sucesso quando o usuário começa a digitar
    if (error) setError("");
    if (success) setSuccess("");
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Executar validações
    const validationError = validateForm(formData);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await signupUser(
        formData.name,
        formData.email,
        formData.cc,
        formData.telefone,
        formData.password
      );

      setSuccess("Conta criada com sucesso! Pode agora fazer login.");
      // Limpar o formulário
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

      // Verificar se é um erro de dados já existentes
      if (errorData.includes("Já existe uma conta")) {
        setError(errorData);
      } else {
        setError(errorData);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <h1>Registo-Estagiário</h1>

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid red",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              color: "green",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid green",
              borderRadius: "4px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nome completo
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Insira o seu nome completo"
            />
          </label>
          <label>
            Número do BI(CC)
            <input
              type="text"
              name="cc"
              value={formData.cc}
              onChange={handleChange}
              placeholder="8 dígitos (ex: 12345678)"
              maxLength="8"
            />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="exemplo@email.com"
            />
          </label>
          <label>
            Número de telemóvel
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="9xxxxxxxx (ex: 912345678)"
            />
          </label>
          <label>
            Palavra-passe
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Insira a palavra-passe"
            />
          </label>
          <label>
            Confirmar palavra-passe
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirme a palavra-passe"
            />
          </label>
          <ButtonSubmit
            text="Criar Conta" 
            isSubmitting={loading} 
            loadingText = "Criar Conta..."
            type="submit"
            variant="primary"
          />
        </form>
        <p>
          Já tens uma conta? <a href="/login">Faz o Login</a>
        </p>
      </div>
    </div>
  );
}

export default RegisterUser;
