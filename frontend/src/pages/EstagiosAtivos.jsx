import React, {useState} from "react";
import BarraSuperiorCE from "../components/BarraSuperiorCE";
import NavBar from "../components/NavBar";
import ButtonGeral from "../components/ButtonGeral";
import "../styles/TabelaEstagiosAtivos.css";


function EstagiosAtivos (){ 
    {/*Elementos da tabela*/}
    const array=[
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:7,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:7,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:15,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:15,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
    ]
    const [ paginaAtual, setpaginaAtual ]= useState(1);
    const linhasPorPagina=2;
    const totalPaginas=Math.ceil(array.length/linhasPorPagina);
    console.log(totalPaginas)
    function mudarpagina(paginaAtual){
        paginaAtual=paginaAtual<1?1: paginaAtual;
        paginaAtual=paginaAtual>totalPaginas?totalPaginas:paginaAtual;
        setpaginaAtual(paginaAtual);
    }
    const startIndex=(paginaAtual-1)*linhasPorPagina
    console.log(array);
    let tabelaAtual = array.slice(startIndex, startIndex + linhasPorPagina);
    console.log(tabelaAtual);
    const temp=[];
    for(let i=0; i<totalPaginas; i++){
        temp.push(i+1)
    }
    return(
        <div style={{
            backgroundColor: "white", 
            minHeight: "100vh",
            backgroundImage: "none"
        }}>
            <NavBar/>
            <BarraSuperiorCE/>
            <div>
                <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", marginLeft:"50px", marginRight:"50px", marginTop:"100px"}}>
                    <ButtonGeral Name="Meus estágios"/>
                    <ButtonGeral Name="Criar novo estágio"/>
                </div>
                <div style={{display:"flex", marginTop:"50px", justifyContent:"center", alignItems:"center", marginBottom:"50px"}}>
                    <input  type="text" placeholder="Procurar"></input>
                </div>
                <div>
                    <div style={{display:"flex", justifyContent:"center"}}>
                    <table>
                        <thead>
                            <tr>
                                <td>Título de Estágio</td>
                                <td>Status</td>
                                <td class="status-ativo">Tipo</td>
                                <td>Candidaturas</td>
                                <td>Lozalização</td>
                                <td>Publicado em</td>
                                <td class="actions">Ações</td>
                            </tr>
                        </thead>
                        <tbody>
                            {tabelaAtual.map((element, index)=>(
                                <tr key={index}>
                                    <td>{element.estagio}</td>
                                    <td>{element.status}</td>
                                    <td>{element.tipo}</td>
                                    <td>{element.candidaturas}</td>
                                    <td>{element.localização}</td>
                                    <td>{element.publicado}</td>
                                    <td>
                                        <a href="">[Ver Candidaturas]</a>
                                        <a href="">[Editar]</a>
                                        <a href="">[Pausar]</a>
                                        <a href="">[Fechar]</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    <div style={{display:"flex", position:""}}>
                        <button onClick={()=>mudarpagina(paginaAtual-1)} disabled={paginaAtual===1}>Anterior</button>
                        {temp.map(element=>(
                            <button
                                key={element}
                                onClick={()=>mudarpagina(element)}
                                style={{
                                    color:paginaAtual==element?"blue":"red",
                                }}
                            >
                                {element}
                            </button>
                        ))}
                        <button onClick={()=>mudarpagina(paginaAtual+1)} disabled={paginaAtual===totalPaginas}>Próxmo</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EstagiosAtivos;