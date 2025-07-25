import React from "react";
import NavBar from "../components/NavBar";
import ButtonGeral from "../components/ButtonGeral";
import { useNavigate } from "react-router-dom";


{/* A pagina que deve abrir quando se clica num estágio, sem ser no butao candidatar me*/}

function InfoEstagio() {
    const navigate = useNavigate();
    return (
    <div>
        <NavBar />
        <div>
            <div>{/*caixa branca*/}
                <div style={{display: "flex", flexDirection: "row"}}>
                    <div>
                        <img alt="Logo da empresa" style={{ width: "100px", height: "100px" }} />
                        <h4>Nome da Empresa</h4>
                        <h6 style={{ fontWeight: "bold" }}>Descrição do estágio</h6>
                    </div>
                    <div>
                        <p>Localização do Estágio</p>
                        <p>Prazo de Candidatura</p>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "row",}}>
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <img alt="imagem da mala" style={{ width: "20px", height: "20px" }} />
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <p style={{ fontWeight: "bold" }}>Detalhes do Estágio</p>
                            <p>Área: Desenvolvimento Web</p>
                            <p>Tipo: Presencial/Híbrido</p>
                        </div>
                    </div>
                    <div>
                        <p>Início: Agosto 2025</p>
                        <p>Duração: 3 meses</p>
                        <p>Horário: Parcial ou Integral</p>
                    </div>
                </div>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <p style={{ fontWeight: "bold" }}>Atividades Principais</p>
                    <ul>
                        <li>Apoio ao desenvolvimento de plataformas web e aplicações internas</li>
                        <li>Integração de API's, testes e manutenção de código</li>
                        <li>Participação em reuniões de equipa e planeamento técnico</li>
                    </ul>
                    <p style={{ fontWeight: "bold" }}>perfil do Candidato Ideal</p>
                    <ul>
                        <li>Estudante de Engenharia Informática (licenciatura ou Mestrado)</li>
                        <li>Conhecimentos em JavaScript, Python ou SQL</li>
                        <li>Boa capacidade de comunicação e gosto por trabalhar em equipa</li>
                    </ul>
                </div>
                <ButtonGeral Name={"Candidatar-me"} className={"btn btn-primary"}/>{/* onClick={() => navigate("/Candidatura")} Adicionar funcao para levar para a pagina de candidatura*/}          
            </div>
        </div>
    </div>
  );
}
export default InfoEstagio;
