import React from "react";
import BarraSuperior from "../components/BarraSuperior";

function CandidaturasFeitas() {
  return (
    <div>
      <BarraSuperior />
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