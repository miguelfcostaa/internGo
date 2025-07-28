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
import Footer from '../src/components/Footer.jsx';

function App() {
  return (
    <Router>
      <div className="App" style={{ minHeight: '100vh', position: 'relative', paddingBottom: '70px' }}>
        <Routes>
          <Route path='/' element={<WelcomePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register-company' element={<RegisterCompany />} />
          <Route path='/register-user' element={<RegisterUser />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/select-user' element={<SelectUser />} />
          <Route path='/profile/:id' element={<Profile />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
