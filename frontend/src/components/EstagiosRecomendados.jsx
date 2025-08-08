import React from 'react';
import { useNavigate } from 'react-router-dom';
import useEstagiosRecomendados from '../hooks/useEstagiosRecomendados';
import styles from '../styles/EstagiosRecomendados.module.css';

const EstagiosRecomendados = ({ limite = 5, showTitle = true, showViewMore = false, layoutType = "horizontal" }) => {
  const navigate = useNavigate();
  const { estagiosRecomendados, loading, error, criterios, recarregar } = useEstagiosRecomendados(limite);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-PT');
  };

  const formatarPontuacao = (pontuacao) => {
    return Math.round(pontuacao);
  };

  const formatarArea = (area) => {
    if (!area) return '';
    
    // Se for array, juntar com espaços
    if (Array.isArray(area)) {
      return area.join(' ');
    }
    
    // Converter para string se necessário
    const areaString = String(area);
    
    // Adicionar espaços antes de letras maiúsculas que não estão no início
    return areaString.replace(/([a-z])([A-Z])/g, '$1 $2');
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
      <div className={styles.estagiosRecomendados}>
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className={styles.loadingSpinner}>
          <p>Carregando recomendações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.estagiosRecomendados}>
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className={styles.errorMessage}>
          <p>Erro ao carregar recomendações: {error}</p>
          <button onClick={recarregar} className={styles.btnRecarregar}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (estagiosRecomendados.length === 0) {
    return (
      <div className={styles.estagiosRecomendados}>
        {showTitle && <h2>Estágios Recomendados</h2>}
        <div className={styles.noRecommendations}>
          <p>Complete o seu perfil para receber recomendações personalizadas!</p>
          <ul>
            <li>Adicione o seu curso</li>
            <li>Indique a sua formação académica</li>
            <li>Liste as suas competências técnicas</li>
            <li>Complete a sua morada com código postal</li>
          </ul>
          <button 
            onClick={() => navigate('/edit-profile')} 
            className={styles.btnCompletarPerfil}
          >
            Completar Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.estagiosRecomendados}>
      {showTitle && (
        <div className={styles.sectionHeader}>
          <h2>Estágios Recomendados para si</h2>
        </div>
      )}
      
   

      <div
        className={layoutType === "grid" ? styles.gridLayout : styles.recommendationsGrid}
        style={
          layoutType === "horizontal" 
            ? {
                display: "flex",
                flexDirection: "row",
                overflowX: "auto",
                gap: "1rem",
                padding: "1rem 0",
              }
            : {}
        }
      >

        {estagiosRecomendados.map((estagio) => (
          <div
            key={estagio._id}
            className={styles.recommendationCard}
            style={
              layoutType === "horizontal" 
                ? {
                    flexShrink: 0,
                    minWidth: "300px",
                    boxSizing: "border-box",
                  }
                : {}
            }
          >
            <div className={styles.cardHeader}>
              <div className={styles.pontuacaoBadge} style={{ backgroundColor: getCorPontuacao(estagio.pontuacaoRecomendacao) }}>
                {formatarPontuacao(estagio.pontuacaoRecomendacao)}% match
              </div>
            </div>
            
            <div className={styles.cardContent}>
              <h3 className={styles.estagioTitle}>{estagio.title}</h3>
              <p className={styles.companyName}>
                <strong>{estagio.company?.name}</strong>
              </p>
              
              <div className={styles.estagioDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Área:</span>
                  <span className={styles.detailValue}>{formatarArea(estagio.area)}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Localização:</span>
                  <span className={styles.detailValue}>{estagio.localizacao}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tipo:</span>
                  <span className={styles.detailValue}>{estagio.tipoEstagio}</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duração:</span>
                  <span className={styles.detailValue}>{estagio.duracao} meses</span>
                </div>
                
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Data Limite:</span>
                  <span className={styles.detailValue}>{formatarData(estagio.prazoCandidatura)}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Data de Início:</span>
                  <span className={styles.detailValue}>{formatarData(estagio.dataInicio)}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.cardFooter}>
              <button 
                onClick={() => handleVerEstagio(estagio._id)}
                className={styles.btnVerEstagio}
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showViewMore && estagiosRecomendados.length > 0 && (
        <div className={styles.viewMoreSection}>
          <button 
            onClick={() => navigate('/recomendacoes')}
            className={styles.btnVerMais}
          >
            Ver Mais Recomendações
          </button>
        </div>
      )}
    </div>
  );
};

export default EstagiosRecomendados;
