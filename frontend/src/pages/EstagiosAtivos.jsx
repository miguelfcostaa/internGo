import React, {useState} from "react";
import BarraSuperiorCE from "../components/BarraSuperiorCE";
import NavBar from "../components/NavBar";
import ButtonGeral from "../components/ButtonGeral";
import styles from "../styles/EstagiosAtivos.module.css";

function EstagiosAtivos (){ 
    {/*Elementos da tabela*/}
    let array=[
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:7,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:7,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:10,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:10,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:15,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
        {
            estagio: "Engenheiro de Software",
            status:"Ativo",
            tipo:"Híbrido",
            candidaturas:15,
            vagas:10,
            localização:"Porto,Portugal",
            publicado:"01/07/2025"
        },
    ]
    const [ paginaAtual, setpaginaAtual ]= useState(1);
    const [ data, setData ] = useState(array);

    const linhasPorPagina=2;
    const totalPaginas=Math.ceil(array.length/linhasPorPagina);

    function mudarpagina(paginaAtual){
        paginaAtual=paginaAtual<1?1: paginaAtual;
        paginaAtual=paginaAtual>totalPaginas?totalPaginas:paginaAtual;
        setpaginaAtual(paginaAtual);
    }

    const startIndex=(paginaAtual-1)*linhasPorPagina
    let tabelaAtual = array.slice(startIndex, startIndex + linhasPorPagina);

    const temp=[];
    for(let i=0; i<totalPaginas; i++){
        temp.push(i+1)
    }

    {/*quando o utlizador clicar em pausar é suposto o status do estagio mudar para pausado, a funçao abaixo nao esta a funcionar*/}
    function PausarEstagio(key){
            const updateData = data.map((elemento,index)=>{
                if(index===key){
                    elemento.status="pausado";
                }
            });
            setData(updateData);
    }
    return(
        <div className={styles.background}>
            <NavBar/>
            <BarraSuperiorCE/>
            <div></div>
            <div>
                <div style={{display:"flex", marginTop:"300px", justifyContent:"center", alignItems:"center", marginBottom:"50px"}}>
                    <input  type="text" placeholder="Procurar"></input>
                </div>
                <div style={{ maxWidth:"80%", marginLeft:"10%", marginRight:"10%"}}>
                    <table className="table table-hover" style={{ maxWidth:"100%", maxHeight:"100%"}}>
                        <thead className={styles.thead}>
                            <tr>
                                <td className={styles.th}>Título de Estágio</td>
                                <td className={styles.th}>Status</td>
                                <td className={styles.th}>Tipo</td>
                                <td className={styles.th}>Candidaturas</td>
                                <td className={styles.th}>Vagas</td>
                                <td className={styles.th}>Lozalização</td>
                                <td className={styles.th}>Publicado em</td>
                                <td className={styles.th}>Ações</td>
                            </tr>
                        </thead>
                        <tbody>
                            {tabelaAtual.map((element, index)=>(
                                <tr key={index} >
                                    <td>{element.estagio}</td>
                                    <td>{element.status}</td>
                                    <td>{element.tipo}</td>
                                    <td>{element.candidaturas}</td>
                                    <td>{element.vagas}</td>
                                    <td>{element.localização}</td>
                                    <td>{element.publicado}</td>
                                    <td>
                                        <a className="link">[Ver Candidaturas]</a>
                                        <a className="link">[Editar]</a>
                                        <a className="link" onClick={()=>PausarEstagio(index)}>[Pausar]</a>
                                        <a className="link">[Fechar]</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div style={{ display:"flex", justifyContent:"right", flexDirection:"row", gap:"5px"}}>
                        <span className={styles.botao} onClick={()=>mudarpagina(paginaAtual-1)} disabled={paginaAtual===1}> {'< Anterior'} </span>
                        {temp.map(element=>(
                        <>
                            <span
                                key={element}
                                onClick={()=>mudarpagina(element)}
                                style={{
                                    fontWeight:paginaAtual==element?"bold":"",
                                    border:"1px solid balack",
                                }}
                            >
                                {element} 
                            </span>
                            <span>{" |"}</span>
                        </>
                        ))}
                        <span onClick={()=>mudarpagina(paginaAtual+1)} disabled={paginaAtual===totalPaginas}>{"Próxmo>"}</span>
                    </div>
                </div>
                <div style={{marginTop:"50px"}}>
                    <ButtonGeral Name="Criar novo estágio" link={`/criar-estagio`} />
                </div>
            </div>
        </div>
    )
}

export default EstagiosAtivos;