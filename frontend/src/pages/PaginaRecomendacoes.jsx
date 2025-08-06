import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import EstagiosRecomendados from '../components/EstagiosRecomendados';
import '../styles/PaginaRecomendacoes.css';
import ButtonVoltar from '../components/ButtonVoltar';

const PaginaRecomendacoes = () => {
  const navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="pagina-recomendacoes">
          <ButtonVoltar onClick={() => navigate(-1)} 
            style={{ position: 'absolute', top: 'rem', left: '1rem' }} />
         <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem 2rem 1rem',
            textAlign: 'center',
            gap: '0.5rem',
          }}
        >
          <div>
             <h1 style={{ fontSize: '2rem', fontWeight: 600, color: '#2c3e50', margin: 0 }}>
            Estágios Recomendados para si
          </h1>
              <p className="subtitle" style={{ margin: 0, maxWidth: '600px' }}>
            Baseado no seu perfil, encontrámos estágios que podem ser do seu interesse
          </p>
          </div>
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
                className="btn-completar-perfil"
              >
                Explorar 
              </button>
            </div>
          </div>
        </div>
    </>
  );
};

export default PaginaRecomendacoes;
