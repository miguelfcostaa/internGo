import React from "react";

function HomePage() {
    return (
        <div>
            <div>{/*barra superior*/}
                <div>Logo</div>
                <span>
                    <form>
                        <input type="text"></input>{/*falta acrescentar a lupa*/}
                    </form>
                </span>
                <span>
                    perfil do utilizador
                </span>
            </div>
            <div>{/*barra lateral esquerda*/}
                <div>
                    <p>Filtro resultados:</p>
                    <p>Informática</p>
                </div>
                <div>
                    <details>
                        <summary>Area</summary>
                        <form>
                            <label>
                                <input type="checkbox"></input>
                            </label>{" "} Informática
                        </form>
                    </details>
                    <details>
                        <summary>Regiao</summary>
                        <form>
                            <label>
                                <input type="checkbox"></input>
                            </label>{" "} Madeira
                        </form>
                    </details>
                    <details>
                        <summary>Duracao</summary>
                        <form>
                            <label>
                                <input type="checkbox"></input>
                            </label>{" "} 1 mês
                        </form>
                    </details>
                    <details>
                        <summary>Tipo de Estágio</summary>
                        <form>
                            <label>
                                <input type="checkbox"></input>
                            </label>{" "} Renumerado
                        </form>
                    </details>
                </div>
            </div>
            <div>{/*caixa dos estagios*/}
                <div>
                    <div>Logo da empresa</div>
                    <div>Nome da empresa</div>
                </div>
                <div>
                    <h6>Nome do Estágio</h6>
                    <table>
                    <tr>
                        <td>Total de Vagas:</td>
                        <td>Ativas</td>
                    </tr>
                    <tr>
                        <td>Area</td>
                        <td>Início</td>
                    </tr>   
                    <tr>
                        <td>Tipo de Estágio</td>
                        <td>Duração</td>
                    </tr>
                    </table>
                </div>
                <div>
                    <p>Lisboa,Portugal</p>
                    <button>Candidatar-me</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage;