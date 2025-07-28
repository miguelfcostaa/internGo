import React, { useEffect, useState } from "react";
import "../styles/Footer.css";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Muestra footer si se hizo scroll más de 100px
      if (window.scrollY > 100) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {showFooter && (
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
      )}
    </>
  );
};

export default Footer;
