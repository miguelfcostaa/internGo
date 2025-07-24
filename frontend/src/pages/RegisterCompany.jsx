import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/RegisterCompany.css'; 

function RegisterCompany(){

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

        if (response.ok) 
        {
            setDone(true);
            setFieldErrors({});
            alert("Empresa registada com sucesso!");
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
            <div className="container bg-white">
                <p className="title">Registo - Empresa</p>
                <form method="POST" onSubmit={handleSubmit} className="form">
                    <div className="container-main">
                        <div className="container-flex">
                            <label className="label">Nome da Empresa </label>
                            <input type="text" placeholder="" name="name" className="input-group-text" />
                            
                            <label className="label">Email da empresa</label>
                            <input type="text" placeholder="" name="email" className="input-group-text" />
                            
                            <label className="label">Palavra-passe</label>
                            <input type="password" placeholder="" name="password" className="input-group-text" />
                        </div>
                        <div className="container-flex">
                            <label className="label"> Número do NIF </label>
                            <input type="text" placeholder="" name="nif" className="input-group-text" />
                            
                            <label className="label">Telefone</label>
                            <div className="input-group">
                                <select className="btn btn-secondary dropdown-toggle" name="phone">
                                    <option value={+351}>+351</option>
                                    <option value={+55}>+55</option>
                                    <option value={+1}>+1</option>
                                    <option value={+58}>+58</option>
                                </select>
                                <input type="text" className="input-group-text" name="phone"/>
                            </div>

                            <label className="label">Confirmar palavra-passe</label>
                            <input type="password" placeholder="" name="confirmPassword" className="input-group-text" />
                        </div>
                    </div>

                    
                    <button type="submit" className="btn btn-primary">Criar Conta</button>
                </form>
                <p>Já tens uma conta? <a href="/login">Faz o Login</a></p>
                {done ? (
                    <div className="alert alert-success text-success"> 
                        Registo efetuado com sucesso! 
                    </div>
                ) : Object.values(fieldErrors).length != 0 ? (
                    <div className="alert alert-danger">
                        {Object.values(fieldErrors).map((error, index) => (
                            <ul key={index}>
                                <li>{error}</li>
                            </ul>
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default RegisterCompany;