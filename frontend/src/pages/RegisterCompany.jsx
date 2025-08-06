import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from '../styles/RegisterCompany.module.css';
import ButtonSubmit from "../components/ButtonSubmit";
import PasswordCriteriaTooltip from "../components/PasswordCriteria";  
import { isPasswordCriterionMet } from "../utils/registerUserUtils"; 

function RegisterCompany() {
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  
  // Estado para armazenar os dados do formulário
  const [formData, setFormData] = useState({
    name: "",
    nif: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Handler para atualizar os dados do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFieldErrors({});
    setLoading(true);

    // Validar passwords aquí si quieres (opcional)

    // Armar data para enviar
    const data = {
      name: formData.name,
      nif: formData.nif,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword
    };

    try {
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
        
        // Limpar formulário
        setFormData({
          name: "",
          nif: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        });

        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        if (result.message && typeof result.message === 'object') {
          setFieldErrors(result.message);
        } else if (typeof result.message === 'string') {
          setFieldErrors({ general: result.message });
        } else {
          setFieldErrors({ general: "Erro desconhecido ao registar." });
        }
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setFieldErrors({ general: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid page-with-background" style={{ height: '100vh', position: 'relative' }}>
  <div className={styles.registerContainer}>
    <h2 className={`text-center mb-3 ${styles.titleDark}`}>Registo - Empresa</h2>

    {done && (
      <div className={`alert ${styles.alertSuccess} text-success`}>
        Empresa registada com sucesso! Redirecionando...
      </div>
    )}

    {Object.keys(fieldErrors).length > 0 && (
      <div className={`alert ${styles.alertDanger}`}>
        <ul className="mb-0">
          {Object.values(fieldErrors).map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    )}

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
              type="email"
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
