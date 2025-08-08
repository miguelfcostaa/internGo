// Função para tratar erros de resposta da API
const handleApiError = (data, defaultMessage) => {
  console.log("Dados do erro recebidos:", data); // Para debug
  
  let errorMessage = data.message || defaultMessage;
  
  // Adicionar detalhes dos erros específicos
  if (data.errors && Array.isArray(data.errors)) {
    errorMessage += `\n\n❌ Problemas encontrados:\n• ${data.errors.join('\n• ')}`;
  }
  
  // Adicionar sugestão se disponível
  if (data.suggestion) {
    errorMessage += `\n\n💡 Sugestão: ${data.suggestion}`;
  }
  
  // Adicionar campos obrigatórios se disponível
  if (data.required && Array.isArray(data.required)) {
    errorMessage += `\n\n📋 Campos obrigatórios: ${data.required.join(', ')}`;
  }
  
  return new Error(errorMessage);
};

// Função para obter token de autenticação
const getAuthToken = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token de autenticação não encontrado. Por favor, faça login novamente.");
  }
  return token;
};

// Função base para requisições autenticadas
const authenticatedFetch = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
  
  // Merge headers, mas não sobrescrever se for FormData
  const headers = options.body instanceof FormData 
    ? { "Authorization": `Bearer ${token}` }
    : { ...defaultHeaders, ...options.headers };
  
  return fetch(url, {
    ...options,
    headers
  });
};

// Função para registrar um novo usuário
export const signupUser = async (name, email, cc, telefone, password) => {
  const requestBody = { name, email, cc, telefone, password };
  
  console.log("Tentando registrar usuário:", { name, email, cc, telefone }); // Debug
  
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log("Status da resposta:", res.status); // Debug
    
    // Tentar fazer parse do JSON independente do status
    let errorData;
    try {
      errorData = await res.json();
      console.log("Dados da resposta:", errorData); // Debug
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError);
      throw new Error(`Erro ${res.status}: Resposta inválida do servidor`);
    }
    
    // Verificar se a resposta não é ok
    if (!res.ok) {
      throw handleApiError(errorData, `Erro ${res.status}: Falha ao registrar usuário`);
    }
    
    return errorData;
  } catch (err) {
    console.error("Erro completo:", err);
    
    // Se for erro de rede/conexão
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error("❌ Erro de conexão: Não foi possível conectar ao servidor. Verifique se o backend está rodando na porta 5000.");
    }
    
    // Re-throw outros erros
    throw err;
  }
};

// Função para login do usuário
export const loginUser = async (email, password) => {
  const requestBody = { email, password };
  
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }
    
    return data;
  } catch (err) {
    console.error("Login error:", err);
    throw err;
  }
};

// Função para criar um novo estágio
export const criarEstagio = async (estagioData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const res = await fetch("http://localhost:5000/api/estagios/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(estagioData),
    });

    const data = await res.json();

    if (!res.ok) {
      
    }

    return data;
  } catch (err) {
    console.error("Create estagio error:", err);
  }
};

// Função para obter estágios recomendados
export const obterEstagiosRecomendados = async (limite = 10) => {
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      throw new Error("Token de autenticação não encontrado");
    }

    const res = await fetch(`http://localhost:5000/api/estagios/recomendados?limite=${limite}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      const errorMessage = data.message || 'Erro ao obter estágios recomendados';
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (err) {
    console.error("Erro ao obter estágios recomendados:", err);
    throw err;
  }
};
