import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/homePage';
import Login from './pages/Login';
import selecionarUtilizador from './pages/selecionarUtilizador';
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
          <Route path='/homePage' element={<Home />}></Route>
          <Route path='/login' element={<ProfilePage />}></Route>
          <Route path='/selecionarUtilizador' element={<selecionarUtilizador />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
