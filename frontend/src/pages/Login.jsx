import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from '../styles/Login.module.css';
import ButtonSubmit from "../components/ButtonSubmit";
import ResetPassword from "./ResetPassword.jsx";

function Login() {

    const navigate = useNavigate();
    const [fieldErrors, setFieldErrors] = useState({});
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        setFieldErrors({});
        setLoading(true);

        const formData = new FormData(event.target);
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        };

        if (!data.email || !data.password) {
            setFieldErrors({ general: "Email e password são obrigatórios." });
            setLoading(false);
            return;
        }

        try {
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
                
                // Simular um pequeno delay para mostrar o loading
                setTimeout(() => {
                    navigate("/home");
                }, 1000);
                
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
        } catch (error) {
            console.error("Erro na requisição:", error);
            setFieldErrors({ general: "Erro de conexão. Tente novamente." });
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginForm}>
                <h2 className={styles.loginTitle}>Entrar</h2>
                <p className={styles.loginSubtitle}>
                    És novo aqui? <Link to="/select-user">Cria uma conta</Link>
                </p>

                <form method="POST" onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.inputLabel}>Email</label>
                        <input 
                            type="email" 
                            className={styles.inputField}
                            name="email" 
                            placeholder="Digite seu email"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.inputLabel}>Palavra-passe</label>
                        <input 
                            type="password" 
                            className={styles.inputField}
                            name="password" 
                            placeholder="Digite sua palavra-passe"
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.checkboxContainer}>
                        <label className={styles.checkbox}>
                            <input 
                                type="checkbox" 
                                id="remember"
                                disabled={loading}
                            />
                            <span className={styles.checkmark}></span>
                        </label>
                        <label htmlFor="remember" className={styles.checkboxLabel}>
                            Mantêm-me logado
                        </label>
                    </div>

                    <ButtonSubmit
                        text="Entrar"
                        isSubmitting={loading}
                        loadingText="Entrando..."
                        type="submit"
                        variant="primary"
                    />
                </form>
                
                <div className={styles.alertContainer}>
                    {done ? (
                        <div className={styles.alertSuccess}> 
                            Login efetuado com sucesso! 
                        </div>
                    ) : Object.values(fieldErrors).length !== 0 ? (
                        <div className={styles.alertError}>
                            {Object.values(fieldErrors).map((error, index) => (
                                <span key={index}>
                                    {error}
                                </span>
                            ))}
                        </div>
                    ) : null}
                </div>
                    
                <Link to="/forget-password" className={styles.resetpasswordLink}>
                    Esqueceu a palavra-passe?
                </Link>
            </div>
        </div>
    );
}

export default Login;
