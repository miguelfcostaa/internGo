import React from "react";
import NavBar from "../components/NavBar";
import ButtonGeral from "../components/ButtonGeral";
import BarraSuperiorCE from "../components/BarraSuperiorCE";
import EstagiosCriados from "../components/EstagiosCriados";
import CandidaturasRecebidas from "../components/CandidaturasRecebidas";

function ProfileCompany() {
    return (
        <div>
            <NavBar/>
            <BarraSuperiorCE/>
            <div style={{ display: "flex", flexDirection:"row", justifyContent: "center", gap: "50px"}}>
                <div style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", gap:"50px"}}>{/*Caixa branca*/}
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <div>logo da empresa</div>
                        <ButtonGeral Name={"Ver mais Detalhes"} className={"ButtonLogout"}/>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column"}}>
                        <p>Nome da Empresa</p>
                        <p>Email da Empresa</p>
                    </div>
                </div>
                <div>
                    <h6 style={{ fontWeight: "bold" }}>Candidaturas Recebidas</h6>
                    <table>
                        <CandidaturasRecebidas 
                            Candidato="João Pedro"
                            Estado={1}
                         />
                         <CandidaturasRecebidas 
                            Candidato="João Manel"
                            Estado={2}
                         />
                         <CandidaturasRecebidas 
                            Candidato="Zé manel"
                            Estado={3}
                         />
                    </table>
                </div>
            </div>
            <div style={{ marginLeft: "50px"}}>
                <h4 >Estágios criados</h4>
                <table >
                    <thead>
                        <tr>
                            <th >Estágio</th>
                            <th>Vagas</th>
                            <th>Mês de Início</th>
                            <th>Duração</th>
                            <th>#</th>
                        </tr>
                    </thead>
                    <tbody>
                         <EstagiosCriados 
                            NomeEstagio="Estágio de Técnico de Sistemas"
                            Ativas={2}
                            Inicio="Julho"
                            Duracao="1"
                         />
                         <EstagiosCriados 
                            NomeEstagio="Estágio de Desenvolvimento Web"
                            Ativas={2}
                            Inicio="Julho"
                            Duracao="1"
                         />
                         <EstagiosCriados 
                            NomeEstagio="Estágio de Técnico de Redes"
                            Ativas={5}
                            Inicio="Agosto"
                            Duracao="3"
                         />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProfileCompany;
