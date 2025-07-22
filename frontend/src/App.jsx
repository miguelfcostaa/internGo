import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import Login from './pages/Login';
import SelecionarUtilizador from './pages/SelecionarUtilizador.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        

        <Routes>
          <Route path='/HomePage' element={<HomePage />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/SelecionarUtilizador' element={<SelecionarUtilizador />}></Route>
          <Route path='/ProfilePage' element={<ProfilePage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
