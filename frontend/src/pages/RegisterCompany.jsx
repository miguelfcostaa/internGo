import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterCompany(){

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

        if (response.ok) 
        {
            navigate("/home");
            console.log("Registration successful:", result);
        } 
        else 
        {
            console.error("Registration failed:", result);
            if (result.message && typeof result.message === 'object') 
            {
                setFieldErrors(result.message);
            } 
            else if (typeof result.message === 'string') 
            {
                setFieldErrors({ general: result.message });
            } 
            else 
            {
                setFieldErrors({ general: "Erro desconhecido ao registar." });
            }
        }
    }
    

    return(
        <div>
            <div className="container">
                <h1>Registo - Empresa</h1>
                <form method="POST" onSubmit={handleSubmit} className="form">
                    <label id="name">Nome da Empresa
                        <input type="text" placeholder="" name="name"></input>
                    </label>
                    <label>Número do NIF
                        <input type="text" placeholder="" name="nif"></input>
                    </label>
                    <label>Email da empresa
                        <input type="text" placeholder="" name="email"></input>
                    </label>
                    <div className="input-group m-3">
                        <select className="btn btn-secondary dropdown-toggle ">
                            <option value={+351}>+351</option>
                            <option value={+55}>+55</option>
                            <option value={+1}>+1</option>
                            <option value={+58}>+58</option>
                        </select>
                        <input type="text" className="form-control" name="phone"/>
                    </div>
                    <label>Palavra-passe
                        <input type="password" placeholder="" name="password"></input>
                    </label>
                    <label>Confirmar palavra-passe
                        <input type="password" placeholder="" name="confirmPassword"></input>
                    </label>
                    <button type="submit" className="btn btn-primary">Criar Conta</button>
                </form>
                <p>Já tens uma conta? <a href="/login">Faz o Login</a></p>
                {Object.keys(fieldErrors).length === 0 ? (
                    <div className="alert alert-success text-success"> 
                        Registo efetuado com sucesso! 
                    </div>
                ) : (
                    <div className="alert alert-danger">
                        {Object.values(fieldErrors).map((error, index) => (
                            <ul key={index}>
                                <li>{error}</li>
                            </ul>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default RegisterCompany;