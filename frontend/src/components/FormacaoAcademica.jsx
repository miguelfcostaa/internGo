import React from "react";

/*Falta importar a lista de formações académicas e ajustar a funcao conforme o tipo de dados importados*/

function FormacaoAcademica() {
    let temp = [];
    {array.forEach(element => {
            temp.push(<li>{element.InstituicaodeEnsino}<li>{element.Curso}</li></li>);
        })}
    return (
        <>
            {temp}
        </>
    );
}

export default FormacaoAcademica;
