import React from "react";
import NavBar from "../components/NavBar";
import BarraSuperior from "../components/BarraSuperiorCE";

function PaginaCriacaoEstagio() {
    return (
        <div>
            <NavBar/>
            <BarraSuperior/>
            <div>
                <h6 style={{ fontWeight: "bold" }}>Publicar Novo Estágio na sua Empresa</h6>
                <div>{/*A caixa para criar um novo estágio*/}
                    <div></div>{/*Aba com as varias paginas a preencher para publicar o estágio*/}
                    <div>
                        <form>
                            <div>
                                <div>
                                    <label  className="">Título do Estágio</label>
                                    <input type="text" placeholder="" className="" onChange={() => {}}></input>{/*Adicionar função devido a ser campo obrigatório*/}
                                    <label className="">Área(s) de Atuação</label>
                                    <input placeholder="" className="" onChange={() => {}}></input>{/*Adicionar função devido a ser campo obrigatório*/}
                                    <label className="">número de Vagas para este Estágio</label>
                                    {/*Adicionar o campo com as setas e adicionar função devido a ser campo obrigatório*/}
                                    <label className="">Localização(ões) do Estágio</label>
                                    <input type="text" placeholder="" className="" onChange={() => {}}></input>{/*Adicionar função devido a ser campo obrigatório*/}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaCriacaoEstagio;