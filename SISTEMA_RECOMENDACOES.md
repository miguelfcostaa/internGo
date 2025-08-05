# Sistema de Recomendações de Estágios - InternGo

## Visão Geral

O sistema de recomendações foi implementado para sugerir estágios personalizados aos utilizadores com base no seu perfil académico e profissional.

## Como Funciona

### Critérios de Recomendação

O sistema calcula uma pontuação de 0 a 100 para cada estágio baseado nos seguintes critérios:

1. **Correspondência de Curso (30%)**
   - Compara o curso do utilizador com os `cursosPreferenciais` do estágio
   - Utiliza algoritmo de similaridade de texto

2. **Correspondência de Área (25%)**
   - Compara a `formacaoAcademica` do utilizador com a `area` do estágio
   - Identifica palavras-chave comuns

3. **Competências Técnicas (25%)**
   - Analisa as `competenciasTecnicas` do utilizador contra `competenciasEssenciais` do estágio
   - Procura por competências em comum

4. **Proximidade Geográfica (15%)**
   - Compara o `codigoPostal` do utilizador com a `localizacao` do estágio
   - Bonificação total para correspondência exata
   - Bonificação parcial para códigos postais próximos

5. **Bonificação para Estágios Remotos (5%)**
   - Estágios remotos recebem pontuação adicional

### Funcionalidades Implementadas

#### Backend
- **Endpoint**: `GET /api/estagios/recomendados`
- **Autenticação**: Requer token JWT
- **Parâmetros**: `limite` (opcional, padrão: 10)
- **Filtros**: Exclui estágios já candidatados e com prazo expirado

#### Frontend
- **Componente**: `EstagiosRecomendados`
- **Hook**: `useEstagiosRecomendados`
- **Páginas**: 
  - Home (mostra 6 recomendações)
  - Página dedicada (mostra até 20 recomendações)

## Estrutura dos Ficheiros

### Backend
```
backend/
├── controllers/estagioController.js (função obterEstagiosRecomendados)
├── routes/estagioRoutes.js (rota /recomendados)
```

### Frontend
```
frontend/src/
├── components/EstagiosRecomendados.jsx
├── hooks/useEstagiosRecomendados.js
├── pages/PaginaRecomendacoes.jsx
├── services/apiService.js (função obterEstagiosRecomendados)
├── styles/
    ├── EstagiosRecomendados.css
    └── PaginaRecomendacoes.css
```

## Como Usar

### Para Utilizadores
1. Complete o seu perfil com:
   - Curso
   - Formação académica
   - Competências técnicas
   - Código postal
2. Aceda à homepage (estando logado)
3. Veja as recomendações personalizadas
4. Clique em "Ver Mais Recomendações" para ver todas

### Para Desenvolvedores

#### Usar o Hook
```jsx
import useEstagiosRecomendados from '../hooks/useEstagiosRecomendados';

const { estagiosRecomendados, loading, error, recarregar } = useEstagiosRecomendados(10);
```

#### Usar o Componente
```jsx
import EstagiosRecomendados from '../components/EstagiosRecomendados';

<EstagiosRecomendados 
  limite={6} 
  showTitle={true} 
  showViewMore={true} 
/>
```

## Melhorias Futuras

1. **Machine Learning**: Implementar algoritmos mais sofisticados
2. **Histórico de Cliques**: Aprender com o comportamento do utilizador
3. **Feedback**: Sistema de rating das recomendações
4. **Colaborativo**: Recomendações baseadas em utilizadores similares
5. **Tags**: Sistema de etiquetas para melhor categorização
6. **Análise de Texto**: NLP para melhor compreensão dos textos

## Testes

### Testar Manualmente
1. Faça login como utilizador
2. Complete o perfil
3. Vá à homepage
4. Verifique se aparecem recomendações
5. Teste a página de recomendações completa

### Casos de Teste
- Utilizador sem perfil completo
- Utilizador com perfil completo
- Utilizador que já se candidatou a todos os estágios
- Diferentes tipos de formação e competências
