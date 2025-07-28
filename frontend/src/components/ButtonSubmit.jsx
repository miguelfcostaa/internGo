import React from 'react';
import styles from '../styles/ButtonSubmitComponent.module.css';

//Componente de um botao de submiting (tbm de loading)
const ButtonSubmit = ({ 
  onClick, 
  text, 
  variant = 'primary', 
  size = 'w100h40', 
  disabled = false, 
  isSubmitting = false,
  type = 'button',
  loadingText = 'Submiting...',
  className = ''
}) => {
  const getClassName = () => {
    let classNames = [styles.buttonSubmiting];
    
    if (variant && styles[variant]) classNames.push(styles[variant]);
    if (size && styles[size]) classNames.push(styles[size]);
    if (disabled || isSubmitting) classNames.push(styles.disabled);
    if (className) classNames.push(className);
    
    return classNames.join(' ');
  };

  return (
    <button
      type={type}
      className={getClassName()}
      onClick={onClick}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? loadingText : text}
    </button>
  );
};



export default ButtonSubmit;