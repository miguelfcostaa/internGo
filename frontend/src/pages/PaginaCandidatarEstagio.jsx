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
        Curso:"",
        localEnsino:"",
        apresentacao:"",
      });
    const [paginaAtual, setpaginaAtual]=useState(1);
    function proximaPagina(){

    }
    function paginaAnterior(){

    }
    return(
        <div>
            <NavBar/>
            <div className={Styles.background}>
                <ButtonVoltar/>
                <div className={Styles.bigbox}>
                    <div className={Styles.boxheader}>
                        <span className={paginaAtual === 1 ? Styles.current: Styles.muted}>1. Informações básicas{" >"}</span>
                        <span className={paginaAtual === 2 ? Styles.current: Styles.muted}>2. Informações básicas{" >"}</span>
                        <span className={paginaAtual === 3 ? Styles.current: Styles.muted}>3. Informações básicas{" >"}</span>
                    </div>
                    {paginaAtual === 1 ? (
                        <form>
                            <div style={{paddingRight:"5%", paddingLeft:"5%"}}>
                                <div style={{display:"flex", flexDirection:"row"}}>
                                    <div style={{display:"flex", flexDirection:"column", width:"50%"}}>
                                        <label className={Styles.labelcoluna}>Nome completo:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>Sexo:{/*criar um menu de opçoes*/}
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>Nº de telefone:
                                            <input type="text" placeholder=""></input>{/*colocar aquelas opçoes dos numeros*/}
                                        </label>
                                        <label className={Styles.labelcoluna}>Morada:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>QNQ:{/*criar um menu de opçoes*/}</label>
                                            <select>
                                                <option></option>{/*criar os resto das opções*/}
                                            </select>
                                        <label className={Styles.labelcoluna}>Curso:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                    </div>
                                    <div style={{display:"flex", flexDirection:"column", width:"50%"}}>
                                        <label className={Styles.labelcoluna}>Data de nascimento:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>nº do cc:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>Email:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.labelcoluna}>Nacionalidade:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                        <label className={Styles.label}>É estudante:{/*criar um menu de opçoes*/}<br></br>
                                            <input type="radio" id="sim"placeholder=""></input>
                                            <label for="sim">Sim</label>
                                            <input style={{marginLeft:"50px"}} type="radio" id="Nao"placeholder=""></input>
                                            <label for="Nao">Nao</label>
                                        </label>
                                        <label className={Styles.labelcoluna}>Universidade/Entidade Formadora:
                                            <input type="text" placeholder=""></input>
                                        </label>
                                    </div>
                                </div>
                                <label style={{marginTop:"50px", width:"100%"}}>Escreva a sua carta de Apresentação
                                    <textarea className={Styles.textarea} rows="6" cols="50"></textarea>
                                </label>
                            </div>
                        </form>
                    ) : paginaAtual === 2 ? (
                        <div></div>
                    ):(
                        <div></div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default PaginaCandidatarEstagio