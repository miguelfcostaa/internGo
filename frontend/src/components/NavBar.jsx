import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import '../styles/NavBar.css'; 
import { getUserRoleFromToken } from '../utils/jwtUtils';

const NavBar = () => {
    const role = getUserRoleFromToken();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [userLoggedIn, setUserLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setUserLoggedIn(!!token); 

        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const id = payload.id;
            getUserInfo(id);
        } else {
            setUserInfo({});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        console.log("userLoggedIn:", userLoggedIn);
    }, [userLoggedIn]);


    const getUserInfo = async (id) => {
        if (role === 'user') {
            const request = await fetch(`http://localhost:5000/api/user/${id}`, {
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
                console.log("Company info:", data);
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
                        <a className="navbar-brand" href="/">
                            <Logo width="80" height="80" />
                        </a>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        <div className="navbar-brand" style={{ cursor: 'pointer' }}>
                            <a className="navbar-brand" href={type === 'user' ? "/profile-user" : "/profile-company"}>
                                <svg style={{ marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                                </svg>
                                <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>
                                    {type === 'user' ? ' USER' : userInfo.name}
                                </span>
                            </a>
                        <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={handleLogoutClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                                </svg>
                            </span>
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