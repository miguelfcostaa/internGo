import React from "react";
import BarraSuperiorUP from "./BarraSuperiorUP"; 
import ButtonVoltar from "./ButtonVoltar";
import FormacaoAcademica from "./FormacaoAcademica";
import CompetenciasTecnicas from "./CompetenciasTecnicas";

function EditUserProfile() {
  return (
    <div>
      <BarraSuperiorUP />
      <ButtonVoltar className={""}/>
      <div>{/*caixa branca */}
        <div style={{display: "flex", flexDirection: "row"}}>{/* Falta adicionar o botão para editar as informações do perfil */}
          <div>
            <img alt="Imagem de perfil do utilizador" style={{borderRadius: "50%", width: "100px", height: "100px"}}/>
          </div>
          <div>
            <div style={{display: "flex", flexDirection: "column"}}>
              <div><span style={{fontWeight: "bold"}}>Nome:</span> Kayne West</div>
              <div><span style={{fontWeight: "bold"}}>Email:</span> kanyewest@mail.com</div>
              <div><span style={{fontWeight: "bold"}}>Idade:</span> 33 anos</div>
              <div><span style={{fontWeight: "bold"}}>Nº do CC:</span> 18927823 2XZ</div>
            </div>
            <div style={{display: "flex", flexDirection: "column"}}>
              <div><span style={{fontWeight: "bold"}}>Nacionalidade:</span> Portuguesa</div>
              <div><span style={{fontWeight: "bold"}}>Aniversário:</span> 8 de Junho 1977</div>
              <div><span style={{fontWeight: "bold"}}>Morada:</span> Rua 143, São João</div>
              <div><span style={{fontWeight: "bold"}}>Nº de telefone:</span> 982 123 274</div>
            </div>
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
          <div>
            {/* Existem um simbolo (+) que nao sei o que faz, e falta adicionar */}
            <h6 style={{fontWeight: "bold"}}>Formação Académica</h6>
            <ul>
              <FormacaoAcademica /> {/* Cria a lista automaticamente */}
            </ul>
          </div>
          <div>
            <h6 style={{fontWeight: "bold"}}>Competências Técnicas</h6>
            <ul>
              <CompetenciasTecnicas /> {/* Cria a lista automaticamente */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUserProfile;
