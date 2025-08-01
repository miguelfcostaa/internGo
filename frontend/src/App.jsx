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
import CriarEstagio from './pages/CriarEstagio.jsx';
import EditProfile from './pages/EditProfile.jsx';
import PaginaEstagio from './pages/PaginaEstagio.jsx';
import PaginaCandidatarEstagio from './pages/PaginaCandidatarEstagio.jsx';
 
function App() {
  return (
        <SearchProvider>
 
    <Router>
      <div className="App" style={{ minHeight: '100vh', position: 'relative', paddingBottom: '70px' }}>
        <Routes>
          <Route path='/' element={<WelcomePage />}></Route>  {/*  Rota da Welcome Page */}
          <Route path='/home' element={<HomePage />}></Route>  {/*  Rota da Home Page */}
          <Route path='/login' element={<Login />}></Route>  {/*  Rota da Login Page */}
          <Route path='/register-company' element={<RegisterCompany />}></Route>  {/*  Rota da Register Company Page */}
          <Route path='/register-user' element={<RegisterUser />}></Route>  {/*  Rota da Register User Page */}
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>  {/*  Rota da Forgot Password Page */}
          <Route path='/reset-password' element={<ResetPassword />}></Route>  {/* Rota para Reset Password */}
          <Route path='/select-user' element={<SelectUser />}></Route>  {/* Rota para selecionar se é Estagiario ou Empresa */}
          <Route path='/edit-profile/:id' element={<EditProfile/>}></Route>  {/* Rota para Criar Estágio */}
          <Route path='/profile/:id' element={<ProtectedRoute><Profile /></ProtectedRoute>}></Route>  {/*  Rota da Profile Page (protegida) */}
          <Route path='/estagios-criados/:id' element={<ProtectedRoute requiredRole="company"><EstagiosCriados /></ProtectedRoute>}></Route>  {/* Rota para Estágios Criados (só empresas) */}
          <Route path='/criar-estagio/' element={<ProtectedRoute requiredRole="company"><CriarEstagio /></ProtectedRoute>}></Route>  {/*  Rota da Criar Estágio Page */}
          <Route path='*' element={<NotFound />}> </Route>  {/* Rota 404 para páginas não encontradas */}
          <Route path='/pagina-estagio/' element={<PaginaEstagio />}></Route>   {/*  Rota info completa de estagio page */}
          <Route path='/candidatar-estagio/' element={<PaginaCandidatarEstagio/>}></Route>   {/*  Rota info completa de estagio page */}
          </Routes>
        <Footer />
      </div>
    </Router>
        </SearchProvider>
 
  );
}
 
export default App;