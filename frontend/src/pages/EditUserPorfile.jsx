import React from "react";
import BarraSuperiorUP from "./BarraSuperiorUP"; 
import ButtonVoltar from "./ButtonVoltar";
import FormacaoAcademica from "./FormacaoAcademica";
import CompetenciasTecnicas from "./CompetenciasTecnicas";

function EditUserProfile() {
  return (
    <div>
      <BarraSuperiorUP />
      <ButtonVoltar />
      <div>
        {/* Falta adicionar o botão para editar as informações do perfil */}
        <div>
          <img alt="Imagem de perfil do utilizador" />
        </div>
        <div>
          <table>
            <tbody>
              <tr>
                <td>Nome: Kayne West</td>
                <td>Nacionalidade: Portuguesa</td>
              </tr>
              <tr>
                <td>Email: kanyewest@mail.com</td>
                <td>Aniversário: 8 de Junho 1977</td>
              </tr>
              <tr>
                <td>Idade: 33 anos</td>
                <td>Morada: Rua 143, São João</td>
              </tr>
              <tr>
                <td>Nº do CC: 18927823 2XZ</td>
                <td>Nº de telefone: 982 123 274</td>
              </tr> {/* Aquí cerré el <tr> que faltaba */}
            </tbody>
          </table>
        </div>
        <div>
          {/* Existem um simbolo (+) que nao sei o que faz, e falta adicionar */}
          <h1>Formação Académica</h1>
          <ul>
            <FormacaoAcademica /> {/* Cria a lista automaticamente */}
          </ul>
        </div>
        <div>
          <h1>Competências Técnicas</h1>
          <ul>
            <CompetenciasTecnicas /> {/* Cria a lista automaticamente */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EditUserProfile;
