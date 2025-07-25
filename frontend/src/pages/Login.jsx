import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css"; 

function Login() {

    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});
    const [done, setDone] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setFieldErrors({});

        const formData = new FormData(event.target);
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        if (!data.email || !data.password) {
            setFieldErrors({ general: "Email e password são obrigatórios." });
            return;
        }

        const response = await fetch("http://localhost:5000/api/login", {
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
            localStorage.setItem("token", result.token);
            navigate("/home");
            console.log("Login successful:", result);
        } else {
            console.error("Login failed:", result);
            if (result.message && typeof result.message === 'object') {
                setFieldErrors(result.message);
            } else if (typeof result.message === 'string') {
                setFieldErrors({ general: result.message });
            } else {
                setFieldErrors({ general: "Erro desconhecido ao fazer login." });
            }
        }

    }


    return (
        <div className="login-container d-flex align-items-center justify-content-center vh-100">
            <div className="login-form bg-white p-4 rounded shadow" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-3">Entrar</h2>
                <p className="text-center">
                    És novo aqui? <Link to="/select-user">Cria uma conta</Link>
                </p>

                <form method="POST" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                            <input type="email" className="form-control" name="email" placeholder="Digite seu email" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password">Palavra-passe</label>
                            <input type="password" className="form-control" name="password" placeholder="Digite sua palavra-passe" />
                        </div>

                        <div className="form-check mb-3">
                            <input type="checkbox" className="form-check-input" id="remember" />
                            <label className="form-check-label" htmlFor="remember">Mantêm-me logado</label>
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                </form>
                <div className="text-center mt-3">
                    {done ? (
                        <div className="alert alert-success text-success"> 
                            Registo efetuado com sucesso! 
                        </div>
                    ) : Object.values(fieldErrors).length !== 0 ? (
                        <div className="alert alert-danger text-danger">
                            {Object.values(fieldErrors).map((error, index) => (
                                <span key={index}>
                                    {error}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
            
                <div className="text-center mt-3">
                    <Link to="/forgot-password">Esqueceu a palavra-passe?</Link>
                </div>  
            </div>
        </div>
    );
}

export default Login;
