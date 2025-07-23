import React from "react";
import { Link } from "react-router-dom";
import "../styles/Login.css"; 

function Login() {
  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="login-form bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Entrar</h2>
        <p className="text-center">
          És novo aqui? <Link to="/select-user">Cria uma conta</Link>
        </p>

        <form>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input type="email" className="form-control" id="email" placeholder="Digite seu email" />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Palavra-passe</label>
            <input type="password" className="form-control" id="password" placeholder="Digite sua palavra-passe" />
          </div>

          <div className="form-check mb-3">
            <input type="checkbox" className="form-check-input" id="remember" />
            <label className="form-check-label" htmlFor="remember">Mantêm-me logado</label>
          </div>

          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>

        <div className="text-center mt-3">
          <Link to="/forgot-password">Esqueceu a palavra-passe?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
