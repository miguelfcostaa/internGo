import React from 'react';
import styles from '../styles/PasswordCriteria.module.css';

//Componente de ver os criterios da password
//À medida que os criterios forem cumpridos vai ficando verde nos criterios cumpridos
function PasswordCriteriaTooltip({ password, isVisible, isPasswordCriterionMet }) {
  if (!isVisible) return null;
  
  return (
    <div className={styles.passwordCriteriaTooltip}>
      <h4>A palavra-passe deve ter:</h4>
      <ul>
        <li className={isPasswordCriterionMet('length', password) ? styles.met : ""}>
          Pelo menos 6 caracteres
        </li>
        <li className={isPasswordCriterionMet('uppercase', password) ? styles.met : ""}>
          Pelo menos uma letra maiúscula
        </li>
        <li className={isPasswordCriterionMet('lowercase', password) ? styles.met : ""}>
          Pelo menos uma letra minúscula
        </li>
        <li className={isPasswordCriterionMet('number', password) ? styles.met : ""}>
          Pelo menos um número
        </li>
        <li className={isPasswordCriterionMet('symbol', password) ? styles.met : ""}>
          Pelo menos um símbolo
        </li>
      </ul>
    </div>
  );
}

export default PasswordCriteriaTooltip;