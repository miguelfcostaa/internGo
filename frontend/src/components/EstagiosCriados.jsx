import React from "react";

function EstagiosCriados({ NomeEstagio, Ativas, Inicio, Duracao }) {
    return (
            <tr>
                <td>{NomeEstagio}</td>
                <td>{Ativas}</td>
                <td>{Inicio}</td>
                <td>{Duracao}</td>
                <td>imagem do lapis</td>
            </tr>
    );
}

export default EstagiosCriados;
