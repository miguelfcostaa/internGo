import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import EstagiosRecomendados from '../components/EstagiosRecomendados';
import '../styles/PaginaRecomendacoes.css';

const PaginaRecomendacoes = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="pagina-recomendacoes">
        <div className="container">
          <div className="header-section">
            <button 
              onClick={() => navigate(-1)} 
              className="btn-voltar"
            >
              ← Voltar
            </button>
            <h1>Estágios Recomendados para Si</h1>
            <p className="subtitle">
              Baseado no seu perfil, encontrámos estágios que podem ser do seu interesse
            </p>
          </div>

          <EstagiosRecomendados limite={20} showTitle={false} />
          
          <div className="cta-section">
            <h3>Não encontrou o que procurava?</h3>
            <p>Complete o seu perfil para receber recomendações ainda mais precisas</p>
            <div className="cta-buttons">
              <button 
                onClick={() => navigate('/edit-profile/:id')} 
                className="btn-completar-perfil"
              >
                Completar Perfil
              </button>
              <button 
                onClick={() => navigate('/home')} 
                className="btn-explorar"
              >
                Explorar Todos os Estágios
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaginaRecomendacoes;
