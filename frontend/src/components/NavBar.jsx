import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import '../styles/NavBar.css'; 
import { getUserRoleFromToken } from '../utils/jwtUtils';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {

    const { setQuery } = useSearch();
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate();

  const role = getUserRoleFromToken();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userID, setUserID] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setUserLoggedIn(!!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const id = payload.id;
        setUserID(id);
        getUserInfo(id);
      } catch (error) {
        console.error('Invalid token format');
        setUserLoggedIn(false);
        setUserInfo({});
      }
    } else {
      setUserInfo({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch user or company info depending on role
  const getUserInfo = async (id) => {
    if (!id) return;

    const endpoint =
      role === 'user'
        ? `http://localhost:5000/api/users/${id}`
        : role === 'company'
        ? `http://localhost:5000/api/companies/${id}`
        : null;

    if (!endpoint) return;

    try {
      const response = await fetch(endpoint, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserInfo(data);
      } else {
        console.error('Error fetching info:', data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setQuery(searchInput);
    setSearchInput('');
    navigate('/home');
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    setShowLogoutModal(false);
    window.location.href = '/home';
  };

  const LogoutModal = () => (
    <div className="modal-overlay">
      <div className="container bg-white rounded shadow" style={{ width: 500, padding: 20, textAlign: 'center' }}>
        <h4>Are you sure you want to logout?</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          <button className="btn btn-danger" onClick={handleConfirmLogout}>Logout</button>
          <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );


    const renderNav = (type) => {
        if (userLoggedIn) {
            return (
                <nav className="navbar" style={{ backgroundColor: "#D7D7D7"}}>
                    <div className="container d-flex align-items-center justify-content-between">
                        <Logo className="navbar-brand" width="80" height="80" />
                        <form className="search-container" onSubmit={handleSearch}>
                            <input
                                className="search-box"
                                type="text"
                                placeholder="Procurar..."
                                aria-label="Search"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                            />
                            <svg className='search-icon' xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#7c7c7cff" class="bi bi-search" viewBox="0 0 16 16">
                              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                            </svg>
                        </form>
                        <div className="navbar-brand position-relative" ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                          className="d-flex align-items-center"
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          onClick={() => setShowDropdown(prev => !prev)}
                        >
                            <span style={{ fontSize: '1.4rem', marginRight: 8 }}>{userInfo.name}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                fill="currentColor" 
                                className="bi bi-caret-down-fill" 
                                viewBox="0 0 16 16"
                            >
                                <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                            </svg>
                        </div>

          {showDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                borderRadius: 5,
                zIndex: 1000,
                minWidth: 140,
              }}
            >
              <a
                href={`/profile/${userID}`}
                onClick={() => setShowDropdown(false)}
                style={{
                  display: 'block',
                  padding: '10px 15px',
                  color: '#000',
                  textDecoration: 'none',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                Ver Perfil
              </a>
              <div
                onClick={() => {
                  setShowLogoutModal(true);
                  setShowDropdown(false);
                }}
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  color: '#000',
                  textAlign: 'right',
                  whiteSpace: 'nowrap',
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>

      </div>
      {showLogoutModal && <LogoutModal />}
    </nav>
  )}};

  // Navbar for no logged user
  const renderNoUserNav = () => (
    <nav className="navbar" style={{ backgroundColor: "#D7D7D7" }}>
      <div className="container d-flex align-items-center justify-content-between">
        <Logo width="80" height="80" />
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
        <div className="navbar-brand">
          <a className="d-flex align-items-center text-decoration-none" href="/login" style={{ color: 'inherit' }}>
            <svg style={{ marginBottom: 5 }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <span style={{ marginLeft: 10, fontSize: '1.4rem' }}>Login</span>
          </a>
        </div>
      </div>
    </nav>
  );

  if (role === 'user' || role === 'company') return renderNav();
  return renderNoUserNav();
};


export default NavBar;
