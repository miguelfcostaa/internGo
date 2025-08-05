import { useState, useEffect } from 'react';
import { obterEstagiosRecomendados } from '../services/apiService';

const useEstagiosRecomendados = (limite = 10, autoLoad = true) => {
  const [estagiosRecomendados, setEstagiosRecomendados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [criterios, setCriterios] = useState(null);

  const carregarEstagiosRecomendados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await obterEstagiosRecomendados(limite);
      
      setEstagiosRecomendados(response.estagios || []);
      setCriterios(response.criterios || null);
    } catch (err) {
      console.error('Erro ao carregar estágios recomendados:', err);
      setError(err.message);
      setEstagiosRecomendados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoLoad) {
      carregarEstagiosRecomendados();
    }
  }, [limite, autoLoad]);

  const recarregar = () => {
    carregarEstagiosRecomendados();
  };

  return {
    estagiosRecomendados,
    loading,
    error,
    criterios,
    recarregar,
    carregarEstagiosRecomendados
  };
};

export default useEstagiosRecomendados;
