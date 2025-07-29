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
import NotFound from './pages/NotFound404.jsx'; // Importando a página 404

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', position: 'relative', paddingBottom: '70px' }}>
        <Routes>
          <Route path='/' element={<WelcomePage />}></Route>  {/*  Rota da Welcome Page */}
          <Route path='/home' element={<HomePage />}></Route>  {/*  Rota da Home Page */}
          <Route path='/login' element={<Login />}></Route>  {/*  Rota da Login Page */}
          <Route path='/register-company' element={<RegisterCompany />}></Route>  {/*  Rota da Register Company Page */}
          <Route path='/register-user' element={<RegisterUser />}></Route>  {/*  Rota da Register User Page */}
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>  {/*  Rota da Forgot Password Page */}
          <Route path='/reset-password-test' element={<ResetPassword />}></Route>  {/* Rota de teste para Reset Password */}
          <Route path='/select-user' element={<SelectUser />}></Route>  {/* Rota para selecionar se é Estagiario ou Empresa */}
          <Route path='/profile/:id' element={<Profile />}></Route>  {/*  Rota da Profile Page (Estagiario) */}
          <Route path='/profile/:id/estagios' element={<EstagiosAtivos />}></Route>  {/* Rota 404 para páginas não encontradas */}
          <Route path='*' element={<NotFound />}></Route>  {/* Rota 404 para páginas não encontradas */}
          
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
