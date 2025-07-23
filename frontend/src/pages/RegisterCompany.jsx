import React from "react";

function RegisterCompany(){
    return(
        <div>
            <div>
                <h1>Registo-Entidade</h1>
                <form>
                    <label>Nome da empresa
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Número do NIF
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Email da empresa
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Número de telefone
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Palavra-passe
                        <input type="password" placeholder=""></input>
                    </label>
                    <label>Confirmar palavra-passe
                        <input type="password" placeholder=""></input>
                    </label>
                    <button type="submit">Criar Conta</button>
                </form>
                <p>Já tens uma conta? <a href="/login">Faz o Login</a></p>
            </div>
        </div>
    )
}

export default RegisterCompany;