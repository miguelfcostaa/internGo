import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import Login from './pages/Login';
import SelecionarUtilizador from './pages/SelecionarUtilizador.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WelcomePage from './pages/WelcomePage.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<WelcomePage />}></Route>  {/*  Rota da Welcome Page */}
          <Route path='/home' element={<HomePage />}></Route>  {/*  Rota da Home Page */}
          <Route path='/login' element={<Login />}></Route>  {/*  Rota da Login Page */}
          <Route path='/selectuser' element={<SelecionarUtilizador />}></Route>  {/* Rota para selecionar se é Estagiario ou Empresa */}
          <Route path='/profile' element={<ProfilePage />}></Route>  {/*  Rota da Profile Page (Estagiario) */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
