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
    if (!data.name || !data.email || !data.phone || !data.nif || !data.password || !data.confirmPassword) {
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
    if (data.phone && !validatePhoneNumber(data.phone)) {
        errors.phone = 'Número de telefone deve ter formato válido (9xxxxxxxx ou +351xxxxxxxxx).';
    }
    else {
        // Verifica se telefone já existe (await)
        const existingCompany = await Company.findOne({ phone: data.phone });
        if (existingCompany) {
            errors.phone = 'Número de telefone já está em uso.';
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

    if (!data.name && !data.email && !data.telefone) {
        errors.general = 'O nome, email e telefone são obrigatórios.';
        return errors;
    }

    // Valida Nome
    if (data.name && !validateName(data.name)) {
        errors.name = 'Nome deve ter entre 3 e 50 caracteres.';
    }
    
    // Valida Email
    if (data.email && !validateEmail(data.email)) {
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
    } else if (data.nif && isNaN(data.nif)) {
        errors.nif = 'NIF deve conter apenas números.';
    }

    // Valida Telefone
    if (data.telefone && data.telefone.length !== 9 && !/^9\d{8}$/.test(data.telefone)) {
        errors.telefone = 'Número de telefone deve conter no minimo 9 digitos e ter o formato 9xxxxxxxx.';
    } 
    else if (data.telefone && isNaN(data.telefone)) {
        errors.telefone = 'Número de telefone deve conter apenas números.';
    }

    // Valida Morada
    if (data.morada && (data.morada.length < 3 || data.morada.length > 100)) {
        errors.morada = 'Morada deve ter entre 3 e 100 caracteres.';
    }

    // Valida Código Postal fomato: "1234-567"
    if (data.codigoPostal && !/^\d{4}-\d{3}$/.test(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve ter o formato XXXX-XXX.';
    } 
    else if (data.codigoPostal && data.codigoPostal.replace("-", "").length !== 7) {
        errors.codigoPostal = 'Código Postal deve ter exatamente 7 caracteres.';
    }
    else if (data.codigoPostal && isNaN(data.codigoPostal.replace("-", ""))) {
        errors.codigoPostal = 'Código Postal deve conter apenas números.';
    }

    // Valida Data de Nascimento AAAA-MM-DD
    if (data.dataNascimento && isNaN(new Date(data.dataNascimento).getTime())) { 
        errors.dataNascimento = 'Data de Nascimento deve ter um formato válido (AAAA-MM-DD).';
    }
    else if (data.dataNascimento && new Date(data.dataNascimento) > new Date()) {
        errors.dataNascimento = 'Data de Nascimento não pode ser no futuro.';
    }
    else if (data.dataNascimento && new Date(data.dataNascimento) < new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())) {
        errors.dataNascimento = 'Data de Nascimento não pode ser mais de 100 anos no passado.';
    }

    // Valida Cartão de Cidadão
    if (data.cc && (data.cc.length !== 8 || !/^\d{8}$/.test(data.cc))) {
        errors.cc = 'Cartão de Cidadão deve ter exatamente 8 dígitos.';
    } 
    else if (data.cc && isNaN(data.cc)) {
        errors.cc = 'Cartão de Cidadão deve conter apenas números.';
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

    if (!data.name && !data.email && !data.nif) {
        errors.general = 'O nome, email e NIF são obrigatórios.';
        return errors;
    }

    // Valida Nome
    if (data.name && !validateName(data.name)) {
        errors.name = 'Nome deve ter entre 3 e 50 caracteres.';
    }

    // Valida Email
    if (data.email && !validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } 

    // Valida Telefone
    if (data.phone && data.phone.length !== 9 && !/^9\d{8}$/.test(data.phone)) {
        errors.phone = 'Número de telefone deve conter exatamente 9 dígitos e ter o formato 9XXXXXXXX.';
    } else if (data.phone && isNaN(data.phone)) {
        errors.phone = 'Número de telefone deve conter apenas números.';
    }

    // Valida NIF
    if (data.nif && !validateNIF(data.nif)) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } else if (data.nif && isNaN(data.nif)) {
        errors.nif = 'NIF deve conter apenas números.';
    }

    // Valida Morada
    if (data.morada && data.morada.length < 3 || (data.morada && data.morada.length > 100)) {
        errors.morada = 'Morada deve ter entre 3 e 100 caracteres.';
    }

    // Valida Código Postal fomato: "1234-567"
    if (data.codigoPostal && !/^\d{4}-\d{3}$/.test(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve ter o formato XXXX-XXX.';
    } 
    else if (data.codigoPostal && data.codigoPostal.length !== 8) {
        errors.codigoPostal = 'Código Postal deve ter exatamente 8 caracteres (incluido o hífen).';
    }
    else if (data.codigoPostal && isNaN(data.codigoPostal)) {
        errors.codigoPostal = 'Código Postal deve conter apenas números.';
    }

    return errors;
}

function validateCriarEstagio(Estagio, data) {
    const errors = {};

    // Todos os campos obrigatórios são precisos
    if (!data.title || !data.area || !data.dataInicio || !data.tipoEstagio || !data.duracao ||
        !data.numeroVagas || !data.localizacao || !data.prazoCandidatura || !data.descricao ||
        !data.beneficios || !data.habilitacoesMinimas) {
        errors.general = 'Todos os campos obrigatórios devem ser preenchidos.';
        return errors;
    }

    // Validação do título
    if (data.title && (data.title.length < 3 || data.title.length > 60)) {
        errors.title = 'O título deve  er entre 3 e 60 caracteres.';
    }

    // Validação da área
    if (data.area && (!Array.isArray(data.area) || data.area.length === 0)) {
        errors.area = 'Deve indicar pelo menos uma área.';
    }

    // Validação da data de início (YYYY-MM)
    if (data.dataInicio && !/^\d{4}-\d{2}$/.test(data.dataInicio)) {
        errors.dataInicio = 'A data de início deve estar no formato AAAA-MM.';
    }
    else if (data.dataInicio && isNaN(Date.parse(data.dataInicio))) {
        errors.dataInicio = 'A data de início não é uma data válida.';
    } 
    else if (data.dataInicio && new Date(data.dataInicio) < new Date()) {
        errors.dataInicio = 'A data de início não pode ser no passado.';
    } 
    else if (data.dataInicio && new Date(data.dataInicio) > new Date(new Date().getFullYear(), new Date().getMonth() + 12, 0)) {
        errors.dataInicio = 'A data de início não pode ser mais de 12 meses no futuro.';
    }

    // Validação do tipo de estágio
    const tiposValidos = ["Presencial", "Remoto", "Híbrido"];
    if (data.tipoEstagio && !tiposValidos.includes(data.tipoEstagio)) {
        errors.tipoEstagio = 'Tipo de estágio inválido. Opções válidas: Presencial, Remoto ou Híbrido.';
    }

    // Validação da duração
    if (data.duracao && (isNaN(data.duracao) || data.duracao <= 0 || data.duracao > 12)) {
        errors.duracao = 'A duração deve ser um número entre 1 e 12 meses.';
    }

    // Validação do número de vagas
    if (data.numeroVagas && (isNaN(data.numeroVagas) || data.numeroVagas < 1 || data.numeroVagas > 100)) {
        errors.numeroVagas = 'O número de vagas deve ser um número entre 1 e 100.';
    }

    // Validação da localização
    if (data.localizacao && data.localizacao.length > 40) {
        errors.localizacao = 'A localização deve ter no máximo 40 caracteres.';
    }

    // Validação do prazo de candidatura
    if (data.prazoCandidatura && isNaN(Date.parse(data.prazoCandidatura))) {
        errors.prazoCandidatura = 'O prazo de candidatura não é uma data válida.';
    } else if (data.prazoCandidatura && new Date(data.prazoCandidatura) < new Date()) {
        errors.prazoCandidatura = 'O prazo de candidatura não pode ser no passado.';
    }
    else if (data.prazoCandidatura && new Date(data.prazoCandidatura) > new Date(data.dataInicio)) {
        errors.prazoCandidatura = 'O prazo de candidatura não pode ser depois da data de início do estágio.';
    }

    // Validação da descrição
    if (data.descricao && data.descricao.length > 500) {
        errors.descricao = 'A descrição deve ter no máximo 500 caracteres.';
    }

    // Validação dos benefícios
    if (data.beneficios && (!Array.isArray(data.beneficios) || data.beneficios.length === 0)) {
        errors.beneficios = 'Deve indicar pelo menos um benefício.';
    }

    // Validação das habilitações mínimas
    if (data.habilitacoesMinimas && !["1", "2", "3", "4", "5", "6", "7", "8"].includes(data.habilitacoesMinimas)) {
        errors.habilitacoesMinimas = 'O nível de habilitação é inválido.';
    }

    // Validação de campos opcionais com limite de caracteres
    if (data.cursosPreferenciais && data.cursosPreferenciais.length > 200) {
        errors.cursosPreferenciais = 'Cursos preferenciais deve ter no máximo 200 caracteres.';
    }

    if (data.competenciasTecnicas && data.competenciasTecnicas.length > 300) {
        errors.competenciasTecnicas = 'Competências técnicas deve ter no máximo 300 caracteres.';
    }

    if (data.competenciasPessoais && data.competenciasPessoais.length > 200) {
        errors.competenciasPessoais = 'Competências pessoais deve ter no máximo 200 caracteres.';
    }

    if (data.idiomas && data.idiomas.length > 150) {
        errors.idiomas = 'Idiomas deve ter no máximo 150 caracteres.';
    }

    if (data.observacoes && data.observacoes.length > 150) {
        errors.observacoes = 'Observações deve ter no máximo 150 caracteres.';
    }

    // Validação de horários (opcional)
    const horaRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/; // formato HH:mm e entre 00:00 e 23:59
    if (data.horaInicio && !horaRegex.test(data.horaInicio)) {
        errors.horaInicio = 'Hora de início inválida, use o formato HH:mm.';
    }
    if (data.horaFim && !horaRegex.test(data.horaFim)) {
        errors.horaFim = 'Hora de fim inválida, use o formato HH:mm.';
    }
    if (data.horaInicio && data.horaFim && new Date(`1970-01-01T${data.horaFim}:00`) <= new Date(`1970-01-01T${data.horaInicio}:00`)) {
        errors.horaFim = 'A hora de fim deve ser depois da hora de início.';
    } 
    else if (data.horaInicio && data.horaFim && new Date(`1970-01-01T${data.horaFim}:00`) - new Date(`1970-01-01T${data.horaInicio}:00`) < 25200000) {
        errors.horaFim = 'A diferença entre a hora de início e a hora de fim deve ser de pelo menos 7 horas.';
    }


    return errors;
}

module.exports = {
    validateCriarEstagio,
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