import React from 'react';
import Logo from './Logo';
import '../styles/NavBar.css'; 

const NavBar = () => {
    
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
                <a className="navbar-brand" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                    </svg>
                    {/* {{ user.firstName }} {{ user.lastName }} */}
                </a>
            </div>
        </nav>
    );
};

export default NavBar;