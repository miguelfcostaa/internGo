import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/apiService";
import ButtonSubmit from "../components/ButtonSubmit";
import { validateForm } from "../utils/registerUserUtils"; // Importar a função de validação
import "../styles/RegisterUser.css"; // Importar o CSS para estilização

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpar erros quando o usuário começar a digitar
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validar formulário
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

      setSuccess("Conta criada com sucesso! Redirecionando para o login...");

      // Limpar formulário
      setFormData({
        name: "",
        cc: "",
        email: "",
        telefone: "",
        password: "",
        confirmPassword: "",
      });

      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Erro no registro:", err);

      // Tratar diferentes tipos de erro
      if (err.response && err.response.data) {
        // Erro do servidor com detalhes
        const errorData = err.response.data;
        if (errorData.message) {
          setError(errorData.message);
        } else if (errorData.errors) {
          // Se houver múltiplos erros de validação
          const errorMessages = Object.values(errorData.errors).join(", ");
          setError(errorMessages);
        } else {
          setError("Erro ao criar conta. Tente novamente.");
        }
      } else if (err.message) {
        // Erro de rede ou outro tipo
        setError(err.message);
      } else {
        setError("Erro ao criar conta. Verifique sua conexão e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h2 className="text-center mb-4 text-primary fw-bold">
                Registo - Estagiário
              </h2>

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="alert alert-success d-flex align-items-center"
                  role="alert"
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nome completo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Insira o seu nome completo"
                    disabled={loading}
                    
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Número do BI (CC) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="cc"
                    className="form-control"
                    value={formData.cc}
                    onChange={handleChange}
                    placeholder="8 dígitos (ex: 12345678)"
                    maxLength="8"
                    disabled={loading}
                  />
                  <div className="form-text">Apenas números, 8 dígitos</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemplo@email.com"
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Número de telemóvel <span className="text-danger">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    className="form-control"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="9xxxxxxxx (ex: 912345678)"
                    disabled={loading}
                  />
                  <div className="form-text">9 dígitos começando por 9</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Palavra-passe <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Insira a palavra-passe"
                    disabled={loading}
                  />
                  <div className="form-text">Mínimo 6 caracteres</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Confirmar palavra-passe <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme a palavra-passe"
                    disabled={loading}
                  />
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
                  <Link
                    to="/login"
                    className="text-decoration-none text-primary fw-semibold"
                  >
                    Faz o Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterUser;
