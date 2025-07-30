import React from "react";
import ButtonVoltar from "../components/ButtonVoltar"
import profileicon from "../assets/ProfileIcon.png"
import NavBar from "../components/NavBar";
import styles from "../styles/EditProfile.module.css"

function EditUserProfile() {
  const formacaoAcademica=[{
    instituicao:"Universidade de Lisboa",
    curso:"Licenciatura em Engenharia Informática",
    anos:"2018-2021",
  },
  {
    instituicao:"Universidade de Lisboa",
    curso:"mestrado em Engenharia Informática",
    anos:"2021-2023",
  }
  ]
    const competenciasTecnicas=[
    "Trabalho em equipa",
    "JavaScript, Python, SQL",   
    "Proatividade, Comunicação",
  ]
  return (
    <>
      <NavBar/>
    <div className={styles.background}>
      <ButtonVoltar />
      <div className="shadow rounded p-2" style={{ backgroundColor:"white", marginTop:"2rem"}}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>{/* Falta adicionar o botão para editar as informações do perfil */}
          <div style={{ marginTop:"25px", marginLeft:"50px"}}>
            <img alt="Imagem de perfil do utilizador" src={profileicon}style={{borderRadius: "50%", width: "250px", height: "250px", backgroundColor:"black", margin:"auto"}}/>
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign:"left", fontSize:"20px", marginTop:"40px", marginBottom:"40px"}}>
            <div><span style={{fontWeight: "bold"}}>Nome:</span> Kayne West</div>
            <div><span style={{fontWeight: "bold"}}>Email:</span> kanyewest@mail.com</div>
            <div><span style={{fontWeight: "bold"}}>Idade:</span> 33 anos</div>
            <div><span style={{fontWeight: "bold"}}>Nº do CC:</span> 18927823 2XZ</div>
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between",textAlign:"left", marginTop:"40px", marginBottom:"40px", fontSize:"20px"}}>
            <div><span style={{fontWeight: "bold"}}>Nacionalidade:</span> Portuguesa</div>
            <div><span style={{fontWeight: "bold"}}>Aniversário:</span> 8 de Junho 1977</div>
            <div><span style={{fontWeight: "bold"}}>Morada:</span> Rua 143, São João</div>
            <div><span style={{fontWeight: "bold"}}>Nº de telefone:</span> 982 123 274</div>
          </div>
          <div style={{marginTop:"25px", marginRight:"50px", fontSize:"20px"}}>
            Editar Perfil
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "row", marginTop:"50px", height:"100%"}}>
          <div className="rounded p-2" style={{border:"1px black", borderRadius:"5px", width:"50%"}}>
            {/* Existem um simbolo (+) que nao sei o que faz, e falta adicionar */}
            <h5 style={{fontWeight: "bold", marginTop:"20px",  fontSize:"25px", marginLeft:"50px", textAlign:"left"}}>Formação Académica</h5>
            <ul>
              {formacaoAcademica.map((element,index)=>(
                <li key={index} style={{fontSize:"20px", textAlign:"left"}}>
                  {element.instituicao}
                  <li style={{marginLeft:"50px"}}>{element.curso}{" ("}{element.anos}{")"}</li>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded p-2"  style={{ width:"50%"}}>
            <div style={{display:"flex", flexDirection:"row", marginTop:"20px", justifyContent:"space-between"}}>
              <h5 style={{fontWeight: "bold", fontSize:"25px", marginLeft:"50px"}}>Competências Técnicas</h5>
              <div style={{ fontSize:"25px", textAlign:"right", marginRight:"50px"}}>+</div>
            </div>
            <ul>
              {competenciasTecnicas.map((element,index)=>(
                <li key={index} style={{fontSize:"20px", textAlign:"left"}}>
                  {element}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default EditUserProfile;
