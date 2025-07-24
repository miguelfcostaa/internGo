import React from "react";

/*Falta importar a lista de Candidaturas Efetuadas */

function CandidaturasFeitas() {
    const temp = [];
    Array.forEach(element => {
        temp.push(
            <tr key={element.id}>
                <td>{element.estagio}</td>
                <td>{element.empresa}</td>
                <td>{element.mesInicio}</td>
                <td>{element.duracao}</td>
                <td><a href={element.link}></a></td>
            </tr>
        );  
    });
    return (
        <>
            {temp};
        </>
    );
}

export default CandidaturasFeitas;
