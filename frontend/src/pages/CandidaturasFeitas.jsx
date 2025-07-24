import React from "react";
import ButtonVoltar from "../components/ButtonVoltar";
import NavBar from "../components/NavBar";

function CandidaturasFeitas() {
  return (
    <div>
      <NavBar />
        <div>
            <h1>Candidaturas Feitas</h1>
            <ButtonVoltar />
        </div>
        <div>
            <CandidaturasFeitas/>
        </div>
    </div>
  );
}

export default CandidaturasFeitas;