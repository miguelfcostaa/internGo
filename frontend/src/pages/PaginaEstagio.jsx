import {React, useState} from "react";
import NavBar from "../components/NavBar";
import ButtonVoltar from "../components/ButtonVoltar";

function PaginaEstagio (){
const [paginaAtual, setpaginaAtual]=useState("1")
    return(
        <div>
            <NavBar/>
            <div>
                <ButtonVoltar />
                {/*
                {paginaAtual === 1 ? (
                    <div style={{ backgroundColor:"#F2F2F2"}}>
                    </div>
                ):
                }
                */}
            </div>
        </div>
    )
}
export default PaginaEstagio;