import React from "react";

function registoEstagiario(){
    return(
        <div>
            <div>
                <h1>Registo-Estagiário</h1>
                <form>
                    <label>Nome completo
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>número do BI(CC)
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Email
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Número de telemovel
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Palavra-passe
                        <input type="text" placeholder=""></input>
                    </label>
                    <label>Confirmar palvra-passe
                        <input type="text" placeholder=""></input>
                    </label>
                    <button type="submit">Criar Conta</button>
                </form>
                <p>ja tens uma conta? <a href="/login">Faz o Login</a></p>
            </div>
        </div>
    )
}

export default registoEstagiario;