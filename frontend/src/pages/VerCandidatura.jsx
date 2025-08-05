import React from "react";
import NavBar from "../components/NavBar";
import style from "../styles/VerCandidatura.module.css"

function VerCandidatura(){
    return (
        <div>
            <NavBar/>
            <div className={style.background}>
                <h1 className={style.heading} style={{marginTop:"30px"}}>Informação Pessoal</h1>
                <div className={style.bigbox}>
                    <div style={{paddingRight:"10%", paddingLeft:"10%"}}>
                        <div className={style.column}>
                            <div className={style.row} style={{marginTop:"20px"}}>
                                <div className={style.rowelement}>Nome:<span className={style.span}>Zé Manel</span></div>
                                <div className={style.rowelement}>Data de Nascimento:<span className={style.span}>01/01/2002</span></div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.row}>
                                <div className={style.rowelement}>Nº do CC:<span className={style.span}>12 345 678</span></div>
                                <div className={style.rowelement}>NIF:<span className={style.span}>123 456 789</span></div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.row}>
                                <div className={style.rowelement}>Morada:<span className={style.span}>Rua, Engenherio João Silva, nº1</span></div>
                                <div className={style.rowelement}>Código Postal:<span className={style.span}>1000-100</span></div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.row} style={{paddingBottom:"10px"}}>
                                <div className={style.rowelement}>Email:<span className={style.span}>zemanel@hotmail.com</span></div>
                                <div className={style.rowelement}>Nº de telemóvel:<span className={style.span}>960 123 456</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className={style.heading}>Formação Académica e Competências Técnicas</h1>
                <div className={style.bigbox}>
                    <div style={{paddingRight:"10%", paddingLeft:"10%"}}>
                        <div className={style.column}>
                            <div className={style.row} style={{marginTop:"20px"}}>
                                <div className={style.rowelement}>Universidade/Entidade Formadora:<br></br><span className={style.span}>Universidade da Beira Interior(UBI)</span></div>
                                <div className={style.rowelement}>Curso:<span className={style.span}>Mestrado Integrado em Engenharia Aeronáutica</span></div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.row} style={{marginTop:"20px"}}>
                                <div className={style.rowelement}>Nível QNQ:<span className={style.span}>Nível 6</span></div>
                                <div className={style.rowelement}>Competências Técnicas:<span className={style.span}>Assembley, Fortran, MathLab</span></div>
                            </div>
                        </div>
                        <div className={style.column}>
                            <div className={style.row} style={{paddingBottom:"10px"}}>
                                <div className={style.rowelement}>CV:<a href="" className={style.link}>O CV do candidato pra poder ser transferido ou visualizado </a></div>{}
                            </div>
                        </div>
                    </div>
                </div>
                <h1 className={style.heading}>Carta de Apresentação</h1>
                <div className={style.bigboxcarta}>
                    <div style={{paddingRight:"10%", paddingLeft:"10%"}}>
                        <div className={style.smallbox}>
                            <div className={style.carta}>Bom dia eu sou o Zé Manel e venho desta forma candidatar a vaga de estágio engeneheiro de alimentos
                                e finalizei o curso de engenharia dos alimentos a 31/12/2024. Ao longo deste curso obti conhecimentos na area da engenharia dos alimentos
                                que acredito que virão a ser uteis para o desempenho das funçoes associados a vaga.
                                Desde muito pequeno que me fascino com a engenharia dos alimentos e a possibilidade de poder a exercer as funções descritas nesta vaga é
                                como um sonho tornado realidade
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default VerCandidatura;