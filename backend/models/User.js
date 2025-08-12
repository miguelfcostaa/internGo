const mongoose = require('mongoose');

// Schema para usuário
const userSchema = new mongoose.Schema({
    name: { // Nome do usuário
        type: String,
        required: true,
        trim: true
    },
    email: { // Email do usuário
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    cc: { // Número do cartão de cidadão
        type: String,
        required: [true, 'Número do cartão de cidadão é obrigatório'],
        unique: true,
        trim: true,
        validate: {
        validator: function(v) {
            return /^\d{8}$/.test(v); 
        },
        message: 'Número do cartão de cidadão deve ter exatamente 8 dígitos'
        }
    },
    telefone: { // Número de telemóvel do usuário
        type: String,
        required: [true, 'Número de telemóvel é obrigatório'],
        trim: true,
        unique: true,
        validate: {
        validator: function(v) {
            // Aceita formatos: 9xxxxxxxx ou +351xxxxxxxxx
            return /^(\+351)?9\d{8}$/.test(v);
        },
        message: 'Número de telemóvel deve ter formato válido (9xxxxxxxx ou +351xxxxxxxxx)'
        }
    },
    password: { // Palavra-passe do usuário
        type: String,
        required: [true, 'Palavra-passe é obrigatória'],
        minlength: [6, 'Palavra-passe deve ter pelo menos 6 caracteres']
    },
    active: { // Indica se o usuário está ativo
        type: Boolean,
        default: true
    },
    resetPasswordToken: { // Token para redefinição de senha
        type: String,
        default: null
    },
    resetPasswordExpires: { // Data de expiração do token de redefinição de senha
        type: Date,
        default: null
    },
    dataNascimento: { // Data de nascimento do utilizador
        type: Date,
    },
    morada: { // Morada do utilizador
        type: String,
    },
    nif: { // Número de Identificação Fiscal
        type: String,
    },
    formacaoAcademica: { // Em niveis
        type: String,
    },
    competenciasTecnicas: { // Competências técnicas do utilizador
        type: Array, 
    },
    codigoPostal: { // Código Postal do utilizador
        type: String,
    },
    universidade: { // Universidade do utilizador
        type: String,
    },
    curso: { // Curso do utilizador
        type: String,
    },
    profilePhoto: { // Foto de perfil do usuário
        type: String,
        default: null
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
