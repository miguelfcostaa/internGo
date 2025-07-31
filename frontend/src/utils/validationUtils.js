// Funções de validação para uso em toda a aplicação

// Valida formato de email
export const validateEmail = (email) => {
  if (!email || email.trim() === "") {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Valida critérios de senha
export const validatePassword = (password) => {
  if (!password || password.trim() === "") {
    return {
      isValid: false,
      message: "A palavra-passe é obrigatória",
      errors: ["A palavra-passe é obrigatória"]
    };
  }
  
  let errors = [];
  
  if (password.length < 6) {
    errors.push("pelo menos 6 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("uma letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("uma letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("um número");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("um símbolo");
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      message: `A palavra-passe deve ter: ${errors.join(", ")}`,
      errors: errors
    };
  }
  
  return {
    isValid: true,
    message: "Senha válida",
    errors: []
  };
};

// Verifica se um critério específico da senha é atendido
export const isPasswordCriterionMet = (criterion, password) => {
  if (!password) return false;

  switch (criterion) {
    case "length":
      return password.length >= 6;
    case "uppercase":
      return /[A-Z]/.test(password);
    case "lowercase":
      return /[a-z]/.test(password);
    case "number":
      return /[0-9]/.test(password);
    case "symbol":
      return /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    default:
      return false;
  }
};

// Valida se duas senhas coincidem
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return {
      isValid: false,
      message: "Confirmação de palavra-passe é obrigatória"
    };
  }
  
  if (password !== confirmPassword) {
    return {
      isValid: false,
      message: "As palavras-passe não coincidem"
    };
  }
  
  return {
    isValid: true,
    message: "Senhas coincidem"
  };
};

// Valida campo obrigatório
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === "") {
    return {
      isValid: false,
      message: `${fieldName} é obrigatório`
    };
  }
  
  return {
    isValid: true,
    message: "Campo preenchido"
  };
};
