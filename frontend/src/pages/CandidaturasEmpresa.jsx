import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ButtonVoltar from '../components/ButtonVoltar';
import { getUserRoleFromToken } from '../utils/jwtUtils';
import useTodasCandidaturas from '../hooks/useTodasCandidaturas';
import styles from '../styles/Profile.module.css';

const CandidaturasEmpresa = () => {
    const { id } = useParams();
    const role = getUserRoleFromToken();
    const { candidaturas, loading } = useTodasCandidaturas(role === 'company' ? id : null);

    // Função para formatar o mês
    const handleMesInicio = (mes) => {
        if (!mes) return '';  
        const meses = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const [ano, mesIndex] = mes.split("-");
        return `${meses[parseInt(mesIndex) - 1]} ${ano}`;
    };

    // Função para obter cor do status
    const getStatusColor = (status) => {
        switch (status) {
            case 'aceite':
                return '#4CAF50'; // Verde
            case 'recusada':
                return '#f44336'; // Vermelho
            case 'pendente':
                return '#FF9800'; // Laranja
            default:
                return '#9E9E9E'; // Cinza
        }
    };

    // Agrupar candidaturas por status
    const candidaturasPorStatus = {
        pendente: candidaturas.filter(c => c.status === 'pendente'),
        aceite: candidaturas.filter(c => c.status === 'aceite'),
        recusada: candidaturas.filter(c => c.status === 'recusada')
    };

    return (
        <>
            <NavBar />
            <div className={styles.background}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                        <ButtonVoltar />
                        <h1 style={{ marginLeft: '1rem', color: '#273F4F' }}>
                            Histórico de Candidaturas
                        </h1>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <p>Carregando candidaturas...</p>
                        </div>
                    ) : candidaturas.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <h3>📋 Nenhuma candidatura encontrada</h3>
                            <p>Sua empresa ainda não recebeu candidaturas.</p>
                        </div>
                    ) : (
                        <div>
                            {/* Resumo */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                                    <h3 style={{ color: '#FF9800', margin: '0 0 0.5rem 0' }}>{candidaturasPorStatus.pendente.length}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Pendentes</p>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                                    <h3 style={{ color: '#4CAF50', margin: '0 0 0.5rem 0' }}>{candidaturasPorStatus.aceite.length}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Aceitas</p>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                                    <h3 style={{ color: '#f44336', margin: '0 0 0.5rem 0' }}>{candidaturasPorStatus.recusada.length}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Recusadas</p>
                                </div>
                                <div className="card" style={{ textAlign: 'center', padding: '1rem' }}>
                                    <h3 style={{ color: '#273F4F', margin: '0 0 0.5rem 0' }}>{candidaturas.length}</h3>
                                    <p style={{ margin: 0, color: '#666' }}>Total</p>
                                </div>
                            </div>

                            {/* Tabela de candidaturas */}
                            <div className="card">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Status</th>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Candidato</th>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Estágio</th>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Data da Candidatura</th>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Data de Resposta</th>
                                            <th style={{ backgroundColor: '#273F4F', color: 'white' }} scope="col">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {candidaturas.map((candidatura) => (
                                            <tr key={candidatura._id}>
                                                <td>
                                                    <span 
                                                        style={{ 
                                                            backgroundColor: getStatusColor(candidatura.status),
                                                            color: 'white',
                                                            padding: '4px 12px',
                                                            borderRadius: '12px',
                                                            fontSize: '0.8rem',
                                                            fontWeight: 'bold',
                                                            textTransform: 'capitalize'
                                                        }}
                                                    >
                                                        {candidatura.status}
                                                    </span>
                                                </td>
                                                <td>{candidatura.user?.name || 'N/A'}</td>
                                                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {candidatura.estagio?.title || 'N/A'}
                                                </td>
                                                <td>
                                                    {candidatura.createdAt 
                                                        ? new Date(candidatura.createdAt).toLocaleDateString('pt-PT')
                                                        : 'N/A'
                                                    }
                                                </td>
                                                <td>
                                                    {candidatura.dataResposta 
                                                        ? new Date(candidatura.dataResposta).toLocaleDateString('pt-PT')
                                                        : candidatura.status === 'pendente' ? 'Aguardando' : 'N/A'
                                                    }
                                                </td>
                                                <td>
                                                    {candidatura.status === 'pendente' ? (
                                                        <a 
                                                            href={`/ver-candidatura/${candidatura._id}`}
                                                            style={{ textDecoration: 'none', color: '#447D9B', fontSize: '0.9rem' }}
                                                        >
                                                            Ver candidatura
                                                        </a>
                                                    ) : (
                                                        <a 
                                                            href={`/estagiario/${candidatura.user._id}`}
                                                            style={{ textDecoration: 'none', color: '#447D9B', fontSize: '0.9rem' }}
                                                        >
                                                            Ver perfil
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CandidaturasEmpresa;
