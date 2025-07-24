import React from "react";
import Logo from "../components/Logo";

function HomePage() {
    return (
        <div>
            <div>{/*barra superior*/}
                <Logo />
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
        </div>
    )
}

export default HomePage;