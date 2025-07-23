import React from "react";

function RegisterCompany(){
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {
            name: formData.get("name"),
            nif: formData.get("nif"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword")
        };

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
                    <div class="input-group mb-3">
                        <button class="btn btn-white bg-primary
                         dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item">+351</a></li>
                            <li><a class="dropdown-item">+55</a></li>
                            <li><a class="dropdown-item">+1</a></li>
                            <li><a class="dropdown-item">+58</a></li>
                        </ul>
                        <input type="text" class="form-control" aria-label="Text input with dropdown button" />
                    </div>
                    <label>Palavra-passe
                        <input type="password" placeholder="" name="password"></input>
                    </label>
                    <label>Confirmar palavra-passe
                        <input type="password" placeholder="" name="confirmPassword"></input>
                    </label>
                    <button type="submit">Criar Conta</button>
                </form>
                <p>Já tens uma conta? <a href="/login">Faz o Login</a></p>
            </div>
        </div>
    )
}

export default RegisterCompany;