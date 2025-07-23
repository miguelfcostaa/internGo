import React from 'react';

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
    return password.length >= 8; // Senha deve ter pelo menos 8 caracteres
}

module.exports = {
    validateName,
    validateEmail,
    validatePhoneNumber,
    validateNIF,
    validatePassword,
};