function validateName(name) {
    return name.length >= 3 && name.length <= 50; // Nome deve ter entre 3 e 50 caracteres
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);    // Valida email com formato padrão 
}

function validatePhoneNumber(phone) {
    return /^(\+351)?9\d{8}$/.test(phone);  // Aceita formatos: 9xxxxxxxx ou +351xxxxxxxxx
}

function validateNIF(nif) {
    return /^\d{9}$/.test(nif); // NIF deve ter exatamente 9 dígitos
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

module.exports = {
    validateName,
    validateEmail,
    validatePhoneNumber,
    validateNIF,
    validatePassword,
};