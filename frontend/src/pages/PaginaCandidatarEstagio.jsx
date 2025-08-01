import {React, useState} from "react";
import ButtonVoltar from "../components/ButtonVoltar";
import NavBar from "../components/NavBar";
import style from"../styles/PaginaCandidatarEstagio.module.css";

function PaginaCandidatarEstagio(){
    const [Warnings, setWarnings] = useState({
    name: false,
    cc: false,
    email: false,
    telemovel: false,
    dataNascimento: false,
    sexo: false,
    morada:false,
    nacionalidade:false,
    nivelQNQ:false,
    curso:false,
    localEnsino:false,
    apresentacao:false,
    carta:false,
  });
  //Estado para armazenar dados do formulário
    const [formData, setFormData] = useState({
        name: "",
        cc: "",
        email: "",
        telemovel: "",
        dataNascimento: "",
        sexo: "",
        morada:"",
        nacionalidade:"",
        nivelQNQ:"",
        curso:"",
        localEnsino:"",
        apresentacao:"",
        carta:"",
      });
      const messageMaxChat="Atingiu o maximo de caracteres permitido"
      const maxChars = 10;
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value.length <= maxChars) {
            setFormData((prev) => ({ ...prev, [name]: value }));
            setWarnings((prev) => ({ ...prev, [name]: value.length === maxChars }));
        } 
  };
    const handlesSubmit = (e) => {
        e.preventDefault();
    }
    return(
        <div>
            <NavBar/>
            <div className={style.background}>
                <ButtonVoltar/>
                <h4 className={style.heading}>Estágio Técnico de sistemas</h4>
                <div className={style.bigbox}>
                    <form onSubmit={handlesSubmit}>
                        <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={style.labelcoluna}>Nome completo:
                                        <input type="text" placeholder="" name="name" value={formData.name} onChange={handleChange}></input>
                                        {/*Mensagem qquando o limite de caracteres é atingindo*/}
                                        {Warnings["name"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                    <label className={style.labelcoluna}>Sexo:{/*criar um menu de opçoes*/}
                                        <select name="sexo" value={formData.sexo} onChange={handleChange}>
                                            <option value="">------</option>
                                            <option value="Masculino">Masculino</option>
                                            <option value="femenino">Femenino</option>
                                            <option value="naoespecifico">Prefiro não especificar</option>
                                        </select>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={style.labelcoluna}>Nº de telemóvel:
                                        <div style={{ display:"flex", flexDirection:"row"}}>
                                        <select style={{width:"20%"}}>
                                            <option value="+351">+351</option>
                                            <option value="+55">+55</option>
                                            <option value="+1">+1</option>
                                            <option value="+58">+58</option>
                                        </select>
                                        <input type="text" placeholder="" name="telemovel" value={formData.telemovel} onChange={handleChange} style={{width:"100%"}}></input>
                                        </div>
                                    </label>
                                    <label className={style.labelcoluna}>Email:
                                        <input type="text" placeholder="" name="email" value={formData.email} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={style.labelcoluna}>Morada:
                                        <input type="text" placeholder="" name="morada" value={formData.morada} onChange={handleChange}></input>
                                        {Warnings["morada"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                    <label className={style.labelcoluna}>Nacionalidade:
                                        <input type="text" placeholder="" name="nacionalidade" value={formData.nacionalidade} onChange={handleChange}></input>
                                        {Warnings["nacionalidade"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={style.labelcoluna}>Data de nascimento:
                                        <input type="text" placeholder="" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange}></input>
                                    </label>
                                    <label className={style.labelcoluna}>nº do cc:
                                        <input type="text" placeholder="" name="cc" value={formData.cc} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={style.labelcoluna}>QNQ:{/*criar um menu de opçoes*/}
                                        <select name="nivelQNQ" onChange={handleChange}>
                                            <option value="">Escolha o seu nível de habilitação</option>
                                            <option value="Nível 1">Nível 1-4ºano do Ensino Básico</option>
                                            <option value="Nível 2">Nível 2-6ºano do Ensino Básico</option>
                                            <option value="Nível 3">Nível 3-9ºano do Ensino Básico</option>
                                            <option value="Nível 4">Nível 4-Ensino Secundário + Estágio Profissional</option>
                                            <option value="Nível 5">Nível 5-Cursos de Especialização Tecnólogica (CET)</option>
                                            <option value="Nível 6">Nível 6-Licenciatura</option>
                                            <option value="Nível 7">Nível 7-Mestrado</option>
                                            <option value="Nível 8">Nível 8-Doutoramento</option>
                                        </select>
                                    </label>
                                    <label className={style.labelcoluna}>Curso:
                                        <input type="text" placeholder="" name="curso" value={formData.curso} onChange={handleChange}></input>
                                        {Warnings["curso"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label  className={style.labelcoluna}>É estudante:
                                        <select name="curso" onChange={handleChange}>
                                            <option value="" >------</option>
                                            <option value="Sim">Sim</option>
                                            <option value="Nao" >Não</option>
                                        </select>
                                    </label>
                                    <label className={style.labelcoluna}>Universidade/Entidade Formadora:
                                        <input type="text" placeholder="" name="localEnsino" value={formData.localEnsino} onChange={handleChange}></input>
                                        {Warnings["localEnsino"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                            </div>
                            <div>
                                <input type="file" style={{ marginTop:"30px"}}></input> {/*Falta guardar este ficheiro*/}
                            </div>
                            <label style={{marginTop:"30px", width:"100%", textAlign:"left"}}>Escreva a sua carta de Apresentação
                                <textarea className={style.textarea} rows="6" cols="50" name="carta" value={formData.carta} onChange={handleChange}></textarea>
                            </label>
                        </div>
                        <input type="submit" value="Candidatar" className={style.submit}></input>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default PaginaCandidatarEstagio