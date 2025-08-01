import {React, useState} from "react";
import ButtonVoltar from "../components/ButtonVoltar";
import NavBar from "../components/NavBar";
import Styles from"../styles/PaginaCandidatarEstagio.module.css";

function PaginaCandidatarEstagio(){
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
  };

    return(
        <div>
            <NavBar/>
            <div className={Styles.background}>
                <ButtonVoltar/>
                <h4 className={Styles.heading}>Estágio Técnico de sistemas</h4>
                <div className={Styles.bigbox}>
                    <form>
                        <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
                            <div style={{display:"flex", flexDirection:"column"}}>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={Styles.labelcoluna}>Nome completo:
                                        <input type="text" placeholder="" name="name" value={formData.name} onChange={handleChange}></input>
                                    </label>
                                    <label className={Styles.labelcoluna}>Sexo:{/*criar um menu de opçoes*/}
                                        <select>
                                            <option name="sexo" value="">------</option>
                                            <option name="sexo" value={formData.sexo} onChange={handleChange}>Masculino</option>
                                            <option name="sexo" value={formData.sexo} onChange={handleChange}>Femenino</option>
                                            <option name="sexo" value={formData.sexo} onChange={handleChange}>Prefiro não especificar</option>
                                        </select>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={Styles.labelcoluna}>Nº de telemóvel:
                                        <input type="text" placeholder="" name="telemovel" value={formData.telemovel} onChange={handleChange}></input>{/*colocar aquelas opçoes dos numeros*/}
                                    </label>
                                    <label className={Styles.labelcoluna}>Email:
                                        <input type="text" placeholder="" name="email" value={formData.email} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={Styles.labelcoluna}>Morada:
                                        <input type="text" placeholder="" name="morada" value={formData.morada} onChange={handleChange}></input>
                                    </label>
                                    <label className={Styles.labelcoluna}>Nacionalidade:
                                        <input type="text" placeholder="" name="nacionalidade" value={formData.nacionalidade} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={Styles.labelcoluna}>Data de nascimento:
                                        <input type="text" placeholder="" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange}></input>
                                    </label>
                                    <label className={Styles.labelcoluna}>nº do cc:
                                        <input type="text" placeholder="" name="cc" value={formData.cc} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label className={Styles.labelcoluna}>QNQ:{/*criar um menu de opçoes*/}
                                        <select>
                                            <option name="nivelQNQ" value="" onChange={handleChange}>Escolha o seu nível de habilitação</option>
                                            <option name="nivelQNQ" value="Nível 1" onChange={handleChange}>Nível 1-4ºano do Ensino Básico</option>
                                            <option name="nivelQNQ" value="Nível 2" onChange={handleChange}>Nível 2-6ºano do Ensino Básico</option>
                                            <option name="nivelQNQ" value="Nível 3" onChange={handleChange}>Nível 3-9ºano do Ensino Básico</option>
                                            <option name="nivelQNQ" value="Nível 4" onChange={handleChange}>Nível 4-Ensino Secundário + Estágio Profissional</option>
                                            <option name="nivelQNQ" value="Nível 5" onChange={handleChange}>Nível 5-Cursos de Especialização Tecnólogica (CET)</option>
                                            <option name="nivelQNQ" value="Nível 6" onChange={handleChange}>Nível 6-Licenciatura</option>
                                            <option name="nivelQNQ" value="Nível 7" onChange={handleChange}>Nível 7-Mestrado</option>
                                            <option name="nivelQNQ" value="Nível 8" onChange={handleChange}>Nível 8-Doutoramento</option>
                                        </select>
                                    </label>
                                    <label className={Styles.labelcoluna}>Curso:
                                        <input type="text" placeholder="" name="curso" value={formData.curso} onChange={handleChange}></input>
                                    </label>
                                </div>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <label  className={Styles.labelcoluna}>É estudante:
                                        <select>
                                            <option name="curso" value=""  onChange={handleChange}>------</option>
                                            <option name="curso" value="Sim" onChange={handleChange}>Sim</option>
                                            <option name="curso" value="Nao" onChange={handleChange}>Não</option>
                                        </select>
                                    </label>
                                    <label className={Styles.labelcoluna}>Universidade/Entidade Formadora:
                                        <input type="text" placeholder="" name="localEnsino" value={formData.localEnsino} onChange={handleChange}></input>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <input type="file" style={{ marginTop:"30px"}}></input> {/*Falta guardar este ficheiro*/}
                            </div>
                            <label style={{marginTop:"30px", width:"100%", textAlign:"left"}}>Escreva a sua carta de Apresentação
                                <textarea className={Styles.textarea} rows="6" cols="50" name="carta" value={formData.carta} onChange={handleChange}></textarea>
                            </label>
                        </div>
                        <input type="submit" value="Candidatar" className={Styles.submit}></input>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default PaginaCandidatarEstagio