import React, { useState } from 'react';
import Styles from '../styles/Sidebar.module.css'; 


export default function Sidebar({ estagio, handleMesInicio }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={Styles.sidebarWrapper}>
      <button
        className={Styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Esconder informações" : "Mostrar informações"}
      >
        {isOpen ? "«" : "»"}
      </button>

      <div className={`${Styles.sidebar} ${isOpen ? Styles.open : Styles.closed}`}>
        <p><strong>Prazo da Candidatura:</strong> {estagio.prazoCandidatura ? new Date(estagio.prazoCandidatura).toLocaleDateString() : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Local de estágio:</strong> {estagio.localizacao || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Mês de Início do Estágio:</strong> {handleMesInicio(estagio.dataInicio) || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Duração:</strong> {estagio.duracao ? (estagio.duracao > 1 ? `${estagio.duracao} Meses` : `${estagio.duracao} Mês`) : <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Número de Vagas:</strong> {estagio.numeroVagas || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Horário do Estágio:</strong> {estagio.horarioEstagio || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
        <p><strong>Benefícios oferecidos:</strong> {estagio.beneficios || <span style={{ color: '#888' }}>Não especificado.</span>}</p>
      </div>
    </div>
  );
}