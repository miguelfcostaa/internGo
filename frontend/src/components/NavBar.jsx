import React, { useEffect, useState, useRef } from 'react';
import Logo from './Logo';
import '../styles/NavBar.css'; 
import { getUserRoleFromToken } from '../utils/jwtUtils';

const NavBar = ({ atProfile }) => {
    const role = getUserRoleFromToken();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userID, setUserID] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setUserLoggedIn(!!token); 

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            setUserID(id);
            getUserInfo(id);
        } else {
            setUserInfo({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
    }, [userLoggedIn, userID]);


    const getUserInfo = async (id) => {
        if (role === 'user') {
            const request = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await request.json();
            if (request.ok) {
                setUserInfo(data);
            } else {
                console.error("Error fetching user info:", data.message);
            }
        }
        else if (role === 'company') {
            const request = await fetch(`http://localhost:5000/api/companies/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await request.json();
            if (request.ok) {
                setUserInfo(data);
            } else {
                console.error("Error fetching company info:", data.message);
            }
        }
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem('token');
        setShowLogoutModal(false);
        window.location.href = '/home'; 
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const LogoutModal = () => (
        <div className="modal-overlay">
            <div className='container bg-white rounded shadow' style={{ width: '500px', padding: '20px', textAlign: 'center' }}>
                <div className="modal-content">
                    <h4>Are you sure you want to logout?</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                        <button className="btn btn-danger" onClick={handleConfirmLogout}>Logout</button>
                        <button className="btn btn-secondary" onClick={handleCancelLogout}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );


    const renderNav = (type) => {
        if (userLoggedIn) {
            return (
                <nav className="navbar" style={{ backgroundColor: "#D7D7D7"}}>
                    <div className="container">
                        <Logo className="navbar-brand" width="80" height="80" />
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="navbar-brand" ref={dropdownRef} style={{ position: 'relative' }}>
                        <div
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            onClick={() => setShowDropdown(prev => !prev)}
                        >
                            <span style={{ marginLeft: '10px', marginRight: '10px', fontSize: '1.4rem', color: atProfile ? "#447D9B" : '#000' }}>
                                {userInfo.name}
                            </span>
                            <svg 
                                style={{ color: atProfile ? "#447D9B" : '#000' }}
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
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                background: '#fff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                borderRadius: '5px',
                                zIndex: 1000,
                            }}>
                                <a
                                    href={`/profile/${userID}`}
                                    style={{
                                        display: 'block',
                                        padding: '10px 15px',
                                        textDecoration: 'none',
                                        color: '#000',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Ver Perfil
                                </a>
                                <div
                                    onClick={() => {
                                        handleLogoutClick();
                                        setShowDropdown(false);
                                    }}
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        color: '#000',
                                        whiteSpace: 'nowrap'
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
            );
        }
        else if (type === 'noUser') {
            return (
                <nav className="navbar" style={{ backgroundColor: "#D7D7D7"}}>
                    <div className="container">
                        <a className="navbar-brand" href="/">
                            <Logo width="80" height="80" />
                        </a>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="navbar-brand">
                            <a className="navbar-brand" href="/login">
                                <svg style={{ marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                                <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>
                                    Login
                                </span>
                            </a>
                        </div>
                    </div>
                </nav>
            );
        }
    }

    if (role === 'user') return renderNav('user');
    else if (role === 'company') return renderNav('company');
    else return renderNav('noUser');
};

export default NavBar;