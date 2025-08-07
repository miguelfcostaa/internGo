import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import style from "../styles/ListaCandidaturas.module.css"
import ButtonVoltar from "../components/ButtonVoltar";
import ButtonGeral from "../components/ButtonGeral";


function ListaCandidaturas(){
    
        const [candidatura, setcandidatura] = useState([{
            nome: "João Zé Manel José",
            nivelQnq: "Nível 6",
            curso: "Crochê Avançado",
            cv: "abre o ficheiro"
        },{
            nome: "João Zé Manel José",
            nivelQnq: "Nível 6",
            curso: "Crochê Avançado",
            cv: "abre o ficheiro"
        },{
            nome: "João Zé Manel José",
            nivelQnq: "Nível 6",
            curso: "Crochê Avançado",
            cv: "abre o ficheiro"
        }]);
    return(
        <>
            <NavBar/>
            <div className={style.background}>
                <div className={style.flexColumn}>
                    <div className={style.flexRow}>
                        <ButtonVoltar/>
                        <h2 className={style.titulo}>
                                Nome do Estágio
                        </h2>
                    </div>
                    <div>
                        <div>
                            <table className={style.table}>
                                <thead  className={style.tablehead}>
                                    <tr className={style.tablerow}>
                                        <td>Nome do Candidato</td>
                                        <td>Nível QNQ</td>
                                        <td>Curso</td>
                                        <td>CV</td>
                                        <td>ver detalhes</td>
                                    </tr>
                                </thead>
                                <tbody className={style.tablebody}>
                                    {candidatura.map((candidatura, index)=>(
                                    <tr key={index} className={style.tablerow} >
                                        <td>{candidatura.nome}</td>
                                        <td>{candidatura.nivelQnq}</td>
                                        <td>{candidatura.curso}</td>
                                        <td><a href="">{candidatura.cv}</a></td>
                                        <td><Link className={style.link} to="">[ver candidatura] </Link></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ListaCandidaturas;