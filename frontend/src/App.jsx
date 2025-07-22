import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/homePage';
import Login from './pages/Login';
import SelecionarUtilizador from './pages/selecionarUtilizador';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="App">
      <Router>
        <nav>
          <Link to="/homePage">Home Page</Link>
          <Link to="/login">Login</Link>
          <Link to="/selecionarUtilizador">selecionar Utilizador</Link>
        </nav>

        <Routes>
          <Route path='/homePage' element={<HomePage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/selecionarUtilizador' element={<SelecionarUtilizador />}></Route>
          <Route path='/profile' element={<ProfilePage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
