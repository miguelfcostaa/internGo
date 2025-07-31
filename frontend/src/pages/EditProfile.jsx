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
        <div style={{ display: "flex", flexDirection: "row", marginLeft:"50px"}}>{/* Falta adicionar o botão para editar as informações do perfil */}
          <div style={{ marginTop:"25px", width:"20%"}}>
            <img alt="Imagem de perfil do utilizador" src={profileicon}style={{borderRadius: "50%", width: "200px", height: "200px", backgroundColor:"black"}}/>
            <div style={{ display:"flex", flexDirection:"row",gap:"10px", marginTop:"25px", fontSize:"20px", marginLeft:"30%"}}>
            Editar Perfil
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#000" className="bi bi-pen" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
            </svg>
          </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign:"left", fontSize:"20px", marginTop:"40px", marginBottom:"40px", marginLeft:"20px", width:"40%"}}>
            <div><span style={{fontWeight: "bold"}}>Nome:</span> Kayne West</div>
            <div><span style={{fontWeight: "bold"}}>Idade:</span> 33 anos</div>
            <div><span style={{fontWeight: "bold"}}>Morada:</span> Rua 143, São João</div>
            <div><span style={{fontWeight: "bold"}}>Nacionalidade:</span> Portuguesa</div>
          </div>
          <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between",textAlign:"left", fontSize:"20px", marginTop:"40px", marginBottom:"40px", marginLeft:"20px", width:"40%"}}>
            <div><span style={{fontWeight: "bold"}}>Email:</span> kanyewest@mail.com</div>
            <div><span style={{fontWeight: "bold"}}>Aniversário:</span> 8 de Junho 1977</div>
            <div><span style={{fontWeight: "bold"}}>Nº de telemóvel:</span> 982 123 274</div>
            <div><span style={{fontWeight: "bold"}}>Nº do CC:</span> 18927823 2XZ</div>
          </div>
        </div>
        <div style={{display: "flex", flexDirection: "row", marginTop:"50px", height:"100%"}}>
          <div className="rounded p-2 border" style={{border:"1px black", borderRadius:"5px", width:"50%"}}>
            <h5 style={{fontWeight: "bold", marginTop:"20px",  fontSize:"25px", marginLeft:"50px", textAlign:"left"}}>Formação Académica</h5>
            <ul style={{fontSize:"20px", textAlign:"left"}}> 
              {formacaoAcademica.map((element,index)=>(
                <li key={index}>
                    {element.instituicao}
                    <li style={{marginLeft:"50px"}}>{element.curso}{" ("}{element.anos}{")"}</li>
                  </li>
              ))}
            </ul>
          </div>
          <div className="rounded p-2 border"  style={{ width:"50%"}}>
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
