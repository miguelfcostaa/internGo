export const validateForm = () => {
    // Verificar se todos os campos obrigatórios estão preenchidos
    if (
      !formData.name ||
      !formData.cc ||
      !formData.email ||
      !formData.telefone ||
      !formData.password
    ) {
      return "Todos os campos são obrigatórios";
    }

    // Validar formato do CC (8 dígitos)
    if (!/^\d{8}$/.test(formData.cc)) {
      return "O número do cartão de cidadão deve ter exatamente 8 dígitos";
    }

    // Validar formato do telefone (formato português)
    if (!/^(\+351)?9\d{8}$/.test(formData.telefone)) {
      return "O número de telemóvel deve ter formato válido (9xxxxxxxx)";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Por favor, insira um email válido";
    }

    // Validar confirmação de palavra-passe
    if (formData.password !== formData.confirmPassword) {
      return "As palavras-passe não coincidem";
    }

    // Validar comprimento da palavra-passe
    if (formData.password.length < 6) {
      return "A palavra-passe deve ter pelo menos 6 caracteres";
    }

    // Se chegou até aqui, não há erros
    return null;
  };