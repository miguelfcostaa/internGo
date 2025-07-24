// Função para tratar erros de resposta da API
const handleErrors = (res) => {
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
};

// Função para registrar um novo usuário
export const signupUser = async (name, email, cc, telefone, password) => {
  const requestBody = { name, email, cc, telefone, password };
  
  try {
    const res = await fetch("http://localhost:5000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      // Melhor tratamento de erro com mais detalhes
      const errorMessage = data.message || 'Erro ao registrar usuário';
      const suggestion = data.suggestion ? `\n\n ${data.suggestion}` : '';
      const errorDetails = data.errors ? ` - ${data.errors.join(', ')}` : '';
      const requiredFields = data.required ? ` - Campos obrigatórios: ${data.required.join(', ')}` : '';
      
      throw new Error(errorMessage + suggestion + errorDetails + requiredFields);
    }
    
    return data;
  } catch (err) {
    console.error("Register error:", err);
    throw err;
  }
};

// Função para login do usuário
export const loginUser = async (email, password) => {
  const requestBody = { email, password };
  
  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
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
