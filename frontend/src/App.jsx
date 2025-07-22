import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <div className="App">
      <Router>
       

        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/login' element={<ProfilePage />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
