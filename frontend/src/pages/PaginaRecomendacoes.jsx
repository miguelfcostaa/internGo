import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import EstagiosRecomendados from '../components/EstagiosRecomendados';
import ButtonVoltar from '../components/ButtonVoltar';
import useEstagiosRecomendados from '../hooks/useEstagiosRecomendados';
import { getUserIdFromToken } from '../utils/jwtUtils';
import '../styles/PaginaRecomendacoes.css';

const PaginaRecomendacoes = () => {
  const navigate = useNavigate();
  const { estagiosRecomendados, loading, error } = useEstagiosRecomendados(20);

  const calcularEstatisticas = () => {
    if (estagiosRecomendados.length === 0) return { total: 0, matchAlto: 0, matchMedio: 0 };
    
    const matchAlto = estagiosRecomendados.filter(e => e.pontuacaoRecomendacao >= 70).length;
    const matchMedio = estagiosRecomendados.filter(e => e.pontuacaoRecomendacao >= 40 && e.pontuacaoRecomendacao < 70).length;
    
    return {
      total: estagiosRecomendados.length,
      matchAlto,
      matchMedio
    };
  };

  const stats = calcularEstatisticas();

  return (
    <>
      <NavBar />
      <div className="pagina-recomendacoes">
        <div className="header-section">
          <div className="back-button">
            <ButtonVoltar 
              onClick={() => navigate(-1)} 
              style={{ 
                color: 'white',
              }}
            />
          </div>
          
          <h1 className="titulo-principal">
            Estágios Recomendados para Si
          </h1>
          <p className="subtitulo">
            Baseado no seu perfil, encontrámos os melhores estágios que combinam consigo. 
            Ordenados pelos matches mais altos para maximizar as suas chances de sucesso.
          </p>
        </div>

        {!loading && !error && estagiosRecomendados.length > 0 && (
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <h3 className="stat-number">{stats.total}</h3>
                <p className="stat-label">Estágios Encontrados</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">{stats.matchAlto}</h3>
                <p className="stat-label">Match Alto (70%+)</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">{stats.matchMedio}</h3>
                <p className="stat-label">Match Médio (40-69%)</p>
              </div>
              <div className="stat-item">
                <h3 className="stat-number">
                  {estagiosRecomendados.length > 0 ? Math.round(estagiosRecomendados[0].pontuacaoRecomendacao || 0) : 0}%
                </h3>
                <p className="stat-label">Melhor Match</p>
              </div>
            </div>
          </div>
        )}

        <div className="content-section">
          {loading ? (
            <div className="loading-message">
              <div className="loading-spinner"></div>
              <h3>A procurar os melhores estágios para si...</h3>
              <p>Por favor aguarde enquanto analisamos o seu perfil</p>
            </div>
          ) : error ? (
            <div className="no-results">
              <div className="empty-state-icon">⚠️</div>
              <h3>Erro ao carregar recomendações</h3>
              <p>Ocorreu um erro ao buscar os estágios. Tente novamente mais tarde.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="btn-completar-perfil"
              >
                Tentar Novamente
              </button>
            </div>
          ) : estagiosRecomendados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3>Nenhuma recomendação encontrada</h3>
              <p>Complete o seu perfil para receber recomendações personalizadas baseadas nas suas competências e interesses.</p>
              <button 
                onClick={() => {
                  const userId = getUserIdFromToken();
                  if (userId) {
                    navigate(`/edit-profile/${userId}`);
                  } else {
                    navigate('/login');
                  }
                }} 
                className="btn-completar-perfil"
              >
                Completar Perfil
              </button>
            </div>
          ) : (
            <div className="recommendations-section">
              <h2 className="section-title">
                Os Seus {estagiosRecomendados.length} Melhores Matches
              </h2>
              <EstagiosRecomendados limite={20} showTitle={false} layoutType="grid" />
            </div>
          )}
        </div>

        {!loading && !error && estagiosRecomendados.length > 0 && (
          <div className="cta-section">
            <h3>Quer melhorar os seus matches?</h3>
            <p>
              Complete o seu perfil com mais detalhes sobre as suas competências, 
              experiências e preferências para receber recomendações ainda mais precisas.
            </p>
            <div className="cta-buttons">
              <button 
                onClick={() => {
                  const userId = getUserIdFromToken();
                  if (userId) {
                    navigate(`/edit-profile/${userId}`);
                  } else {
                    navigate('/login');
                  }
                }} 
                className="btn-completar-perfil"
              >
                Completar Perfil
              </button>
              <button 
                onClick={() => navigate('/home')} 
                className="btn-explorar"
              >
                Explorar Mais
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PaginaRecomendacoes;
