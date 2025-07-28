import React from 'react';
import styles from '../styles/PasswordCriteria.module.css';

//Componente de ver os criterios da password
//À medida que os criterios forem cumpridos vai ficando verde nos criterios cumpridos
function PasswordCriteriaTooltip({ password, isVisible, isPasswordCriterionMet }) {
  if (!isVisible) return null;
  
  return (
    <div className={styles.passwordCriteriaTooltip}>
      <h4>Password must have:</h4>
      <ul>
        <li className={isPasswordCriterionMet('length', password) ? styles.met : ""}>
          At least 6 characters
        </li>
        <li className={isPasswordCriterionMet('uppercase', password) ? styles.met : ""}>
          At least one uppercase letter
        </li>
        <li className={isPasswordCriterionMet('lowercase', password) ? styles.met : ""}>
          At least one lowercase letter
        </li>
        <li className={isPasswordCriterionMet('number', password) ? styles.met : ""}>
          At least one number
        </li>
        <li className={isPasswordCriterionMet('symbol', password) ? styles.met : ""}>
          At least one symbol
        </li>
      </ul>
    </div>
  );
}

export default PasswordCriteriaTooltip;