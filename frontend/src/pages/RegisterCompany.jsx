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
                    <div className="input-group m-3">
                        <select className="btn btn-secondary dropdown-toggle ">
                            <option value={+351}>+351</option>
                            <option value={+55}>+55</option>
                            <option value={+1}>+1</option>
                            <option value={+58}>+58</option>
                        </select>
                        <input type="text" className="form-control" aria-label="Text input with dropdown button" />
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