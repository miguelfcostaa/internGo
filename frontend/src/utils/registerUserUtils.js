// Funções de validação individuais
function validateName(name) {
  if (!name || name.trim() === "") {
    return "O nome é obrigatório";
  }
  if (name.length < 3) {
    return "O nome deve ter pelo menos 3 caracteres";
  }
  if (name.length > 50) {
    return "O nome deve ter no máximo 50 caracteres";
  }
  return null;
}

function validateCC(cc) {
  if (!cc || cc.trim() === "") {
    return "O número do cartão de cidadão é obrigatório";
  }
  if (!/^\d{8}$/.test(cc)) {
    return "O número do cartão de cidadão deve ter exatamente 8 dígitos";
  }
  return null;
}

function validateEmail(email) {
  if (!email || email.trim() === "") {
    return "O email é obrigatório";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Por favor, insira um email válido";
  }
  return null;
}

function validateTelefone(telefone) {
  if (!telefone || telefone.trim() === "") {
    return "O número de telemóvel é obrigatório";
  }
  if (!/^(\+351)?9\d{8}$/.test(telefone)) {
    return "O número de telemóvel deve ter formato válido (9xxxxxxxx)";
  }
  return null;
}

function validatePassword(password) {
  if (!password || password.trim() === "") {
    return "A palavra-passe é obrigatória";
  }
  
  let errors = [];
  
  if (password.length < 6) {
    errors.push("pelo menos 6 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("pelo menos uma letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("pelo menos uma letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("pelo menos um número");
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("pelo menos um símbolo");
  }
  
  if (errors.length > 0) {
    return `A palavra-passe deve ter: ${errors.join(", ")}`;
  }
  
  return null;
}
//Codigo para ver se o criterio de palavra passe foi obtido
const isPasswordCriterionMet = (criterion, password) => {
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

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword || confirmPassword.trim() === "") {
    return "A confirmação da palavra-passe é obrigatória";
  }
  if (password !== confirmPassword) {
    return "As palavras-passe não coincidem";
  }
  return null;
}

function validateRequiredFields(formData) {
  const requiredFields = ['name', 'cc', 'email', 'telefone', 'password', 'confirmPassword'];
  const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === "");
  
  if (missingFields.length > 0) {
    return "Todos os campos são obrigatórios";
  }
  return null;
}

// Função principal de validação
export const validateForm = (formData) => {
  // Verificar campos obrigatórios primeiro
  const requiredFieldsError = validateRequiredFields(formData);
  if (requiredFieldsError) {
    return requiredFieldsError;
  }

  // Validar cada campo individualmente
  const nameError = validateName(formData.name);
  if (nameError) return nameError;

  const ccError = validateCC(formData.cc);
  if (ccError) return ccError;

  const emailError = validateEmail(formData.email);
  if (emailError) return emailError;

  const telefoneError = validateTelefone(formData.telefone);
  if (telefoneError) return telefoneError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) return passwordError;

  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) return confirmPasswordError;

  // Se chegou até aqui, não há erros
  return null;
};

// Exportar funções individuais para uso em outros lugares se necessário
export {
  validateName,
  validateCC,
  validateEmail,
  validateTelefone,
  validatePassword,
  validateConfirmPassword,
  validateRequiredFields,
  isPasswordCriterionMet
};