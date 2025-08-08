import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import styles from "../styles/ListaCandidaturas.module.css"
import ButtonVoltar from "../components/ButtonVoltar";
import ButtonGeral from "../components/ButtonGeral";


function ListaCandidaturas(){
    {/*Pagina que aparece após clicar ver candidaturas na tabela dos estágios criados*/}
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
            <div className={styles.background}>
                <div className={styles.flexColumn}>
                    <div className={styles.flexRow}>
                        <ButtonVoltar/>
                        <h2 className={styles.titulo}>
                                Nome do Estágio
                        </h2>
                    </div>
                    <div>
                        <div>
                            <table className="table table-hover shadow align-middle">
                                <thead >
                                    <tr>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Nome do Candidato</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem"}} scope="col">Nível QNQ</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">Curso</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">CV</th>
                                        <th style={{ backgroundColor: '#273F4F', color: 'white', padding: "1rem" }} scope="col">ver detalhes</th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tablebody}>
                                    {candidatura.map((candidatura, index)=>(
                                    <tr key={index} className={styles.tablerow} >
                                        <td>{candidatura.nome}</td>
                                        <td>{candidatura.nivelQnq}</td>
                                        <td>{candidatura.curso}</td>
                                        <td><a href="">{candidatura.cv}</a></td>
                                        <td><Link className={styles.link} to="'/ver-candidatura/:id'">[ver candidatura] </Link></td>{/*Deve abriar a pagina da candidatura com os restantes detalhes*/}
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