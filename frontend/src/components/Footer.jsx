import React, { useEffect, useState } from "react";
import styles from "../styles/Footer.module.css"; // Importa el CSS como módulo

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer className={`${styles.footer} ${showFooter ? styles.visible : styles.hidden}`}>
      <div className={styles["footer-content"]}>
        <p>&copy; {new Date().getFullYear()} InternGO. Todos os direitos reservados.</p>
        <div className={styles["footer-links"]}>
          <a href="">Sobre</a>
          <a href="#">Contacto</a>
          <a href="#">Privacidade</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
