const Company = require('../models/Company');
const validations = require('../utils/validations');


async function validateCompanyInput(data) {
    const errors = {};

    // 0. Verifica se todos os campos estão preenchidos
    if (!data.name || !data.email || !data.phone || !data.nif || !data.password || !data.confirmPassword) {
        errors.general = 'Todos os campos são obrigatórios.';
        return errors;
    }

    // 1. Valida nome
    if (!validations.validateName(data.name)) {
        errors.name = 'Nome da empresa deve ter entre 3 e 50 caracteres.';
    }

    // 2. Valida email (formato)
    if (!validations.validateEmail(data.email)) {
        errors.email = 'Email deve ter formato válido.';
    } else {
        // Verifica se email já existe (await)
        const existingCompany = await Company.findOne({ email: data.email });
        if (existingCompany) {
            errors.email = 'Email já está em uso.';
        }
    }

    // 3. Valida telefone
    if (!validations.validatePhoneNumber(data.phone)) {
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
    if (!validations.validateNIF(data.nif)) {
        errors.nif = 'NIF deve ter exatamente 9 dígitos.';
    } else {
        // Verifica se NIF já existe (await)
        const existingCompany = await Company.findOne({ nif: data.nif });
        if (existingCompany) {
            errors.nif = 'NIF já está em uso.';
        }
    }

    // 5. Valida password (tamanho)
    if (!validations.validatePassword(data.password)) {
        errors.password = 'Password deve ter pelo menos 8 caracteres.';
    }

    // 6. Confirma password
    if (data.password !== data.confirmPassword) {
        errors.password = 'Passwords não coincidem.';
    }

    return errors;
}

module.exports = validateCompanyInput;
