import React, { useState } from "react";
import styles from "../styles/ResetPassword.module.css";

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    console.log("Nova senha confirmada:", newPassword);
  };

  return (
    <div className={styles.appWrapper}>
      <div className={styles.resetContainer}>
        <h2>Altere a palavra-passe</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="newPassword">Nova palavra passe</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={styles.inputField}
            value={newPassword}
            placeholder="Digite a nova palavra passe"
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Confirmar palavra passe</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={styles.inputField}
            value={confirmPassword}
            placeholder="Confirme a nova palavra passe"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button}>Confirmar</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
