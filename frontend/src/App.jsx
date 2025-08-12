import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import Login from './pages/Login';
import SelectUser from './pages/SelectUser.jsx';
import Profile from './pages/Profile.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import RegisterUser from './pages/RegisterUser.jsx';
import RegisterCompany from './pages/RegisterCompany.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Footer from './components/Footer.jsx';
import EstagiosCriados from './pages/EstagiosCriados.jsx';
import NotFound from './pages/NotFound404.jsx'; // Importando a página 404
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { SearchProvider } from "./contexts/SearchContext.js";
import { CandidaturasProvider } from "./contexts/CandidaturasContext.js";
import CriarEstagio from './pages/CriarEstagio.jsx';
import EditProfile from './pages/EditProfile.jsx';
import PaginaEstagio from './pages/PaginaEstagio.jsx';
import PaginaCandidatarEstagio from './pages/PaginaCandidatarEstagio.jsx';
import PaginaRecomendacoes from './pages/PaginaRecomendacoes.jsx';
import EditarEstagio from './pages/EditarEstagio.jsx';
import ProfileEstagiario from './pages/ProfileEstagiario.jsx';
import VerCandidatura from './pages/VerCandidatura.jsx';
import CandidaturasEmpresa from './pages/CandidaturasEmpresa.jsx';
import ListaCandidaturas from './pages/ListaCandidaturas.jsx';
 
function App() {
  return (
    <CandidaturasProvider>
      <SearchProvider>
        <Router>
      <div className="App" style={{ minHeight: '100vh', position: 'relative', paddingBottom: '70px' }}>
        <Routes>
           {/*  Rota da Welcome Page */}
          <Route path='/' element={<WelcomePage />}></Route> 
           {/*  Rota da Home Page */}
          <Route path='/home' element={<HomePage />}></Route>  
           {/*  Rota da Login Page */}
          <Route path='/login' element={<Login />}></Route> 
          {/*  Rota da Register Company Page */}
          <Route path='/register-company' element={<RegisterCompany />}></Route>  
          {/*  Rota da Register User Page */}
          <Route path='/register-user' element={<RegisterUser />}></Route>  
          {/*  Rota da Forgot Password Page */}
          <Route path='/forgot-password' element={<ForgotPassword />}></Route> 
           {/* Rota para Reset Password */}
          <Route path='/reset-password' element={<ResetPassword />}></Route>  
          {/* Rota para selecionar se é Estagiario ou Empresa */}
          <Route path='/select-user' element={<SelectUser />}></Route>  
          {/* Rota para Editar Estágio */}
          <Route path='/edit-profile/:id' element={<EditProfile/>}></Route>  
          {/* Rota para o Perfil */}
          <Route path='/profile/:id' element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>  
            {/* Rota para Estágios Criados (só empresas) */}
          <Route path='/estagiario/:id' element={<ProtectedRoute requiredRole="company"><ProfileEstagiario /></ProtectedRoute>}></Route>
          {/* Rota para Estágios Criados (só empresas) */}
          <Route path='/estagios-criados/:id' element={<ProtectedRoute requiredRole="company"><EstagiosCriados /></ProtectedRoute>}></Route>  
          {/*  Rota da Criar Estágio Page */}
          <Route path='/criar-estagio/' element={<ProtectedRoute requiredRole="company"><CriarEstagio /></ProtectedRoute>}></Route>  
           {/* Rota para editar um estágio específico */}
          <Route path='/estagio/:id/editar' element={<ProtectedRoute requiredRole="company"><EditarEstagio /></ProtectedRoute>}></Route>
          {/*  Rota info completa de estagio page*/} 
          <Route path='/estagio/:id' element={<PaginaEstagio />}></Route>   
          {/*  Rota info completa de estagio page */}
          <Route path='/candidatar-estagio/:id' element={<ProtectedRoute><PaginaCandidatarEstagio/></ProtectedRoute>}></Route>   
          {/*  Rota de recomendações */}
          <Route path='/recomendacoes' element={<ProtectedRoute requiredRole="user"><PaginaRecomendacoes /></ProtectedRoute>}></Route>   
          {/*  Rota para histórico de candidaturas da empresa */}
          <Route path='/candidaturas-empresa/:id' element={<ProtectedRoute requiredRole="company"><CandidaturasEmpresa /></ProtectedRoute>}></Route>   
          {/* Rota para ver candidatura específica */}
          <Route path='/ver-candidatura/:id' element={<ProtectedRoute requiredRole="company"><VerCandidatura /></ProtectedRoute>}></Route>   
          {/* Rota para ver candidaturas de um estágio específico */}
          <Route path='/candidaturas/:id' element={<ProtectedRoute requiredRole="company"><ListaCandidaturas /></ProtectedRoute>}></Route>     
          {/* Rota 404 para páginas não encontradas */}
          <Route path='*' element={<NotFound />}> </Route>  
          </Routes>
        <Footer />
      </div>
    </Router>
      </SearchProvider>
    </CandidaturasProvider>
  );
}
 
export default App;