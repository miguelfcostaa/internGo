import React, { useState } from 'react';
import Styles from '../styles/Sidebar.module.css'; 


export default function Sidebar({ estagio, handleMesInicio }) {
  if (!estagio) {
    return <div>Carregando informações...</div>; // o simplemente null para no mostrar nada
  }


 return (
  <div className={Styles.sidebarWrapper}>
    <div className={Styles.sidebar}>
      <h3>Detalhes do Estágio</h3>
      {estagio ? (
        <>
          <p><strong>Prazo da Candidatura:</strong> {estagio.prazoCandidatura ? new Date(estagio.prazoCandidatura).toLocaleDateString() : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Local de estágio:</strong> {estagio.localizacao || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Mês de Início:</strong> {handleMesInicio(estagio.dataInicio) || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Duração:</strong> {estagio.duracao ? (estagio.duracao > 1 ? `${estagio.duracao} Meses` : `${estagio.duracao} Mês`) : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Número de Vagas:</strong> {estagio.numeroVagas || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Horário do Estágio:</strong> {estagio.horarioEstagio || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
          <p><strong>Benefícios:</strong> {estagio.beneficios || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        </>
      ) : (
        <p style={{ color: '#888' }}>Informações não disponíveis.</p>
      )}
    </div>
  </div>
);
};
