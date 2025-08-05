const listaNacionalidades = [
    'Portuguesa', 'Espanhola', 'Francesa', 'Alemã', 'Italiana', 'Britânica',
    'Americana', 'Brasileira', 'Argelina', 'Angolana', 'Moçambicana'
];


function validateName(name) {
    return name.length >= 3 && name.length <= 50; // Nome deve ter entre 3 e 50 caracteres
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);    // Valida email com formato padrão 
}

function validatePhoneNumber(telefone) {
    return /^9\d{8}$/.test(telefone); // Aceita formatos: 9xxxxxxxx
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
  

async function validateCompanyInput(Company ,data) {
    const errors = {};

    // 0. Verifica se todos os campos estão preenchidos
    if (!data.name || !data.email || !data.telefone || !data.nif || !data.password || !data.confirmPassword) {
        errors.general = 'Todos os campos são obrigatórios.';
        return errors;
    }

    // 1. Valida nome
    if (data.name && !validateName(data.name)) {
        errors.name = 'Nome da empresa deve ter entre 3 e 50 caracteres.';
    } else {
        // Verifica se nome já existe (await)
        const existingCompany = await Company.findOne({ name: data.name });
        if (existingCompany) {
            errors.name = 'Nome da empresa já está em uso.';
        }
    }

    // 2. Valida email (formato)
    if (data.email && !validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } else {
        // Verifica se email já existe (await)
        const existingCompany = await Company.findOne({ email: data.email });
        if (existingCompany) {
            errors.email = 'Email já está em uso.';
        }
    }

    // 3. Valida telefone
    if (data.telefone && !validatePhoneNumber(data.telefone)) {
        errors.telefone = 'Número de telefone deve ter formato válido (9xxxxxxxx ou +351xxxxxxxxx).';
    }
    else {
        // Verifica se telefone já existe (await)
        const existingCompany = await Company.findOne({ telefone: data.telefone });
        if (existingCompany) {
            errors.telefone = 'Número de telefone já está em uso.';
        }
    }

    // 4. Valida NIF
    if (data.nif && !validateNIF(data.nif)) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } else {
        // Verifica se NIF já existe (await)
        const existingCompany = await Company.findOne({ nif: data.nif });
        if (existingCompany) {
            errors.nif = 'NIF já está em uso.';
        }
    }

    // 5. Valida password usando a função importada do validations.js
    const passwordError = validatePassword(data.password);
    if (passwordError) {
        errors.password = passwordError;
    }

    // 6. Confirma password
    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'As palavras-passe não coincidem.';
    }

    return errors;
}


const validateUserUpdate = async (User, data) => {
    const errors = {};

    // Valida Nome
    if (!validateName(data.name)) {
        errors.name = 'Nome deve ter entre 3 e 50 caracteres.';
    }
    
    // Valida Email
    if (!validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } else {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser && existingUser._id.toString() !== data._id) {
            errors.email = 'Email já está em uso.';
        }
    }

    // Valida NIF
    if (data.nif && data.nif.length !== 9) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } else {
        const existingUser = await User.findOne({ nif: data.nif });
        if (existingUser && existingUser._id.toString() !== data._id) {
            errors.nif = 'NIF já está em uso.';
        }
    }

    // Valida Telefone
    if (data.telefone && data.telefone.length !== 9) {
        errors.telefone = 'Número de telefone deve conter no minimo 9 digitos.';
    } else {
        const existingUser = await User.findOne({ telefone: data.telefone });
        if (existingUser && existingUser._id.toString() !== data._id) {
            errors.telefone = 'Número de telefone já está em uso.';
        }
    }

    // Valida Morada
    if (data.morada.length < 3 || data.morada.length > 100) {
        errors.morada = 'Morada deve ter entre 3 e 100 caracteres.';
    }

    // Valida Código Postal fomato: "1234-567"
    if (data.codigoPostal && !/^\d{4}-\d{3}$/.test(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve ter o formato XXXX-XXX.';
    }

    // Valida Data de Nascimento
    if (data.dataNascimento && isNaN(new Date(data.dataNascimento).getTime())) { 
        errors.dataNascimento = 'Data de Nascimento deve ter um formato válido.';
    }

    // Valida Cartão de Cidadão
    if (data.cc && (data.cc.length !== 8 || !/^\d{8}$/.test(data.cc))) {
        errors.cc = 'Cartão de Cidadão deve ter exatamente 8 dígitos.';
    } else {
        const existingUser = await User.findOne({ cc: data.cc });
        if (existingUser && existingUser._id.toString() !== data._id) {
            errors.cc = 'Cartão de Cidadão já está em uso.';
        }
    }

    // Valida Universidade
    if (data.universidade && (data.universidade.length < 3 || data.universidade.length > 50)) {
        errors.universidade = 'Universidade deve ter entre 3 e 50 caracteres.';
    }

    // Valida Curso
    if (data.curso && (data.curso.length < 3 || data.curso.length > 50)) {
        errors.curso = 'Curso deve ter entre 3 e 50 caracteres.';
    }

    return errors;
}


async function validateCandidatura(data) {
    const errors = {};

    if (!data.name || !data.email || !data.nif || !data.telefone || !data.morada || !data.codigoPostal || !data.dataNascimento || !data.cc || !data.universidade || !data.curso || !data.cartaDeApresentacao) {
        errors.general = 'Todos os campos são obrigatórios.';
        return errors;
    }

    // Valida Nome
    if (!validateName(data.name)) {
        errors.name = 'Nome deve ter entre 3 e 50 caracteres.';
    }
    
    // Valida Email
    if (!validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } 

    // Valida NIF
    if (data.nif && data.nif.length !== 9) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } 

    // Valida Telefone
    if (data.telefone && data.telefone.length !== 9) {
        errors.telefone = 'Número de telefone deve conter no minimo 9 digitos.';
    } 

    // Valida Morada
    if (data.morada && (data.morada.length < 3 || data.morada.length > 100)) {
        errors.morada = 'Morada deve ter entre 3 e 100 caracteres.';
    }

    // Valida Código Postal fomato: "1234-567"
    if (data.codigoPostal && !/^\d{4}-\d{3}$/.test(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve ter o formato XXXX-XXX.';
    }

    // Valida Data de Nascimento
    if (data.dataNascimento && isNaN(new Date(data.dataNascimento).getTime())) { 
        errors.dataNascimento = 'Data de Nascimento deve ter um formato válido.';
    }

    // Valida Cartão de Cidadão
    if (data.cc && (data.cc.length !== 8 || !/^\d{8}$/.test(data.cc))) {
        errors.cc = 'Cartão de Cidadão deve ter exatamente 8 dígitos.';
    } 

    // Valida Universidade
    if (data.universidade && (data.universidade.length < 3 || data.universidade.length > 50)) {
        errors.universidade = 'Universidade deve ter entre 3 e 50 caracteres.';
    }

    // Valida Curso
    if (data.curso && (data.curso.length < 3 || data.curso.length > 50)) {
        errors.curso = 'Curso deve ter entre 3 e 50 caracteres.';
    }

    // Valida Carta de Apresentação
    if (data.cartaDeApresentacao && (data.cartaDeApresentacao.length < 10 || data.cartaDeApresentacao.length > 500)) {
        errors.cartaDeApresentacao = 'Carta de Apresentação deve ter entre 10 e 500 caracteres.';
    }

    return errors;
}

async function validateCompanyUpdate(Company, data) {
    const errors = {};

    // Valida Nome
    if (data.name && !validateName(data.name)) {
        errors.name = 'Nome deve ter entre 3 e 50 caracteres.';
    }

    // Valida Email
    if (data.email && !validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } else {
        const existingCompany = await Company.findOne({ email: data.email });
        if (existingCompany) {
            errors.email = 'Email já está em uso.';
        }
    }

    // Valida Telefone
    if (data.telefone && data.telefone.length !== 9) {
        errors.telefone = 'Número de telefone deve conter exatamente 9 dígitos.';
    } else {
        const existingCompany = await Company.findOne({ telefone: data.telefone });
        if (existingCompany) {
            errors.telefone = 'Número de telefone já está em uso.';
        }
    }

    // Valida NIF
    if (data.nif && !validateNIF(data.nif)) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } else {
        const existingCompany = await Company.findOne({ nif: data.nif });
        if (existingCompany) {
            errors.nif = 'NIF já está em uso.';
        }
    }

    // Valida Morada
    if (data.morada && data.morada.length < 3 || (data.morada && data.morada.length > 100)) {
        errors.morada = 'Morada deve ter entre 3 e 100 caracteres.';
    }

    // Valida Código Postal fomato: "1234-567"
    if (data.codigoPostal && !/^\d{4}-\d{3}$/.test(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve ter o formato XXXX-XXX.';
    }

    return errors;
}

module.exports = {
    validateCandidatura,
    validateCompanyUpdate,
    validateUserUpdate,
    validateCompanyInput,
    validateName,
    validateEmail,
    validatePhoneNumber,
    validateNIF,
    validatePassword,
};