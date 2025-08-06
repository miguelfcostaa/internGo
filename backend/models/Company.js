const { Schema, model } = require('mongoose');

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    nif: {
        type: String,
        required: true,
        unique: true,
    },
    morada: {
        type: String,
    },
    codigoPostal: {
        type: String,
    },
    image: {
        type: String,
    },
    profilePhoto: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

module.exports = model('Company', companySchema);