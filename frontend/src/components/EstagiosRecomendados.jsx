import React from 'react';
import { useNavigate } from 'react-router-dom';
import useEstagiosRecomendados from '../hooks/useEstagiosRecomendados';
import '../styles/EstagiosRecomendados.css';

const EstagiosRecomendados = ({ limite = 5, showTitle = true, showViewMore = false }) => {
  const navigate = useNavigate();
  const { estagiosRecomendados, loading, error, criterios, recarregar } = useEstagiosRecomendados(limite);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-PT');
  };

  const formatarPontuacao = (pontuacao) => {
    return Math.round(pontuacao);
  };

  const getCorPontuacao = (pontuacao) => {
    if (pontuacao >= 70) return '#4CAF50'; // Verde
    if (pontuacao >= 40) return '#FF9800'; // Laranja
    return '#9E9E9E'; // Cinza
  };

  const handleVerEstagio = (estagioId) => {
    navigate(`/estagio/${estagioId}`);
  };

  if (loading) {
    return (
      <div className="estagios-recomendados">
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className="loading-spinner">
          <p>Carregando recomendações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="estagios-recomendados">
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className="error-message">
          <p>Erro ao carregar recomendações: {error}</p>
          <button onClick={recarregar} className="btn-recarregar">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (estagiosRecomendados.length === 0) {
    return (
      <div className="estagios-recomendados">
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className="no-recommendations">
          <p>Complete o seu perfil para receber recomendações personalizadas!</p>
          <ul>
            <li>Adicione o seu curso</li>
            <li>Indique a sua formação académica</li>
            <li>Liste as suas competências técnicas</li>
            <li>Complete a sua morada com código postal</li>
          </ul>
          <button 
            onClick={() => navigate('/edit-profile')} 
            className="btn-completar-perfil"
          >
            Completar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="estagios-recomendados">
      {showTitle && (
        <div className="section-header">
          <h2>Estágios Recomendados para si</h2>
        </div>
      )}
      
   

      <div
      className="recommendations-grid"
      style={{
        display: "flex",
        flexDirection: "row",
        overflowX: "auto",
        gap: "1rem",
        padding: "1rem 0",
      }}
    >

        {estagiosRecomendados.map((estagio) => (
             <div
          key={estagio._id}
          className="recommendation-card"
          style={{
            flexShrink: 0,
            minWidth: "300px",  // Ajusta el ancho mínimo que quieras para cada card
            boxSizing: "border-box",
          }}
        >
            <div className="card-header">
              <div className="pontuacao-badge" style={{ backgroundColor: getCorPontuacao(estagio.pontuacaoRecomendacao) }}>
                {formatarPontuacao(estagio.pontuacaoRecomendacao)}% match
              </div>
            </div>
            
            <div className="card-content">
              <h3 className="estagio-title">{estagio.title}</h3>
              <p className="company-name">
                <strong>{estagio.company?.name}</strong>
              </p>
              
              <div className="estagio-details">
                <div className="detail-item">
                  <span className="detail-label">Área:</span>
                  <span className="detail-value">{estagio.area}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Localização:</span>
                  <span className="detail-value">{estagio.localizacao}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Tipo:</span>
                  <span className="detail-value">{estagio.tipoEstagio}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Duração:</span>
                  <span className="detail-value">{estagio.duracao} meses</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Prazo:</span>
                  <span className="detail-value">{formatarData(estagio.prazoCandidatura)}</span>
                </div>
              </div>
            </div>
            
            <div className="card-footer">
              <button 
                onClick={() => handleVerEstagio(estagio._id)}
                className="btn-ver-estagio"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showViewMore && estagiosRecomendados.length > 0 && (
        <div className="view-more-section">
          <button 
            onClick={() => navigate('/recomendacoes')}
            className="btn-ver-mais"
          >
            Ver Mais Recomendações
          </button>
        </div>
      )}
    </div>
  );
};

export default EstagiosRecomendados;
