import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home.jsx';
import Login from './pages/Login';
import SelectUser from './pages/SelectUser.jsx';
import ProfileUser from './pages/ProfileUser.jsx';
import ProfileCompany from './pages/ProfileCompany.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<WelcomePage />}></Route>  {/*  Rota da Welcome Page */}
          <Route path='/home' element={<HomePage />}></Route>  {/*  Rota da Home Page */}
          <Route path='/login' element={<Login />}></Route>  {/*  Rota da Login Page */}
          <Route path='/register' element={<Register />}></Route>  {/*  Rota da Register Page */}
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>  {/*  Rota da Forgot Password Page */}
          <Route path='/select-user' element={<SelectUser />}></Route>  {/* Rota para selecionar se é Estagiario ou Empresa */}
          <Route path='/profile-user' element={<ProfileUser />}></Route>  {/*  Rota da Profile Page (Estagiario) */}
          <Route path='/profile-company' element={<ProfileCompany />}></Route>  {/*  Rota da Profile Page (Empresa) */}

        </Routes>
      </Router>
    </div>
  );
}

export default App;
