import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} EstágiosPro. Todos os direitos reservados.</p>
                <div className="footer-links">
                    <a href="#">Sobre</a>
                    <a href="#">Contacto</a>
                    <a href="#">Privacidade</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
