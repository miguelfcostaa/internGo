import React from "react";

function PaginaCandidaturasRecebidas({Candidato, Estado}){
    return (
        <tbody>
            <tr>
                <td>{Candidato}</td>
                <td>{Estado}</td>
                <td><a href="">ver candidatura</a></td>
            </tr>
        </tbody>
    );

}
export default PaginaCandidaturasRecebidas; 