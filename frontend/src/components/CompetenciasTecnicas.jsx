import React from "react";
//import array 
{(/*Falta importar a lista de competências técnicas */)}

function CompetenciasTecnicas() {
    let temp = [];
    {array.forEach(element => {
            temp.push(<li>{element}</li>);
        })}
    return (
        <>
            {temp}
        </>
    );
}

export default CompetenciasTecnicas;
