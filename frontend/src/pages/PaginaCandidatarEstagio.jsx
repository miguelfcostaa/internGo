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
    const handleChange = ( maxChars = 10000 ) => (e)=> {
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
                <div style={{marginTop:"40px", textAlign:"left", marginBottom:"10px"}}>Prencha os campos abaixo para se candidatar ao Estágio.</div>{/*Adicionar mensagem, possivelmente, aqui caso os campos nao estejam todos preenchidos*/}
                <div className={style.bigbox}>
                    <form onSubmit={handlesSubmit}>
                        <div style={{paddingRight:"10%", paddingLeft:"10%",marginTop:"20px"}}>
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Nome completo:
                                        <input  type="text" placeholder="" name="name" value={formData.name} className={style.input} onChange={handleChange(100)}></input>
                                        {/*Mensagem qquando o limite de caracteres é atingindo*/}
                                        {Warnings["name"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                    <label className={style.labelcoluna}>Nacionalidade:
                                        <input type="text" placeholder="" name="nacionalidade" value={formData.nacionalidade} className={style.input} onChange={handleChange(100)}></input>
                                        {Warnings["nacionalidade"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Nº de telemóvel:
                                        <div style={{ display:"flex", flexDirection:"row"}}>
                                        <select style={{width:"20%"}} className={style.select}>
                                            <option value="+351">+351</option>
                                            <option value="+55">+55</option>
                                            <option value="+1">+1</option>
                                            <option value="+58">+58</option>
                                        </select>
                                        <input type="text" placeholder="" name="telemovel" value={formData.telemovel} className={style.input} onChange={handleChange()} style={{width:"100%"}}></input>
                                        </div>
                                    </label>
                                    <label className={style.labelcoluna}>Email:
                                        <input type="text" placeholder="" name="email" value={formData.email} className={style.input} onChange={handleChange()}></input>
                                    </label>
                                </div>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Morada:
                                        <input type="text" placeholder="" name="morada" value={formData.morada} className={style.input} onChange={handleChange(1000)}></input>
                                        {Warnings["morada"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                    <label className={style.labelcoluna}>Código postal:
                                        <input type="text" placeholder="" name="nacionalidade" value={formData.nacionalidade} className={style.input} onChange={handleChange(100)}></input>
                                        {Warnings["nacionalidade"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Data de nascimento:
                                        <input type="date" name="dataNascimento" value={formData.dataNascimento} className={style.inputdate} onChange={handleChange()}></input>
                                    </label>
                                    <label className={style.labelcoluna}>Nº do CC:
                                        <input type="text" placeholder="" name="cc" value={formData.cc} className={style.input} onChange={handleChange()}></input>
                                    </label>
                                </div>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Nível QNQ:{/*criar um menu de opçoes*/}
                                        <select name="nivelQNQ" className={style.select} onChange={handleChange()}>
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
                                    <label className={style.labelcoluna}>Universidade/Entidade Formadora:
                                        <input type="text" placeholder="" name="localEnsino" value={formData.localEnsino} className={style.input} onChange={handleChange(100)}></input>
                                        {Warnings["localEnsino"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                </div>
                                <div className={style.formrow}>
                                    <label className={style.labelcoluna}>Curso:
                                        <input type="text" placeholder="" name="curso" value={formData.curso} className={style.input} onChange={handleChange(100)}></input>
                                        {Warnings["curso"] && (
                                            <span className={style.charterror}>
                                            {messageMaxChat}
                                            </span>
                                        )}
                                    </label>
                                    <label className={style.labelcoluna}>Adicione o seu CV:
                                        <input type="file" className={style.inputfile}></input> {/*Falta guardar este ficheiro*/}
                                    </label>
                                </div>
                            </div>
                            <label style={{marginTop:"30px", width:"100%", textAlign:"left"}}>Escreva a sua carta de Apresentação:
                                <textarea className={style.textarea} rows="6" cols="50" name="carta" value={formData.carta}  onChange={handleChange()}></textarea>
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