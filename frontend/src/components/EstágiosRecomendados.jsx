import React from "react";
import array 
{(/*Falta importar a lista de Estágios Recomendados e adicionar o logo*/)}

function EstagiosRecomendados() {
    temp=[];
    array.forEach(element => {
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

export default EstagiosRecomendados;