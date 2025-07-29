const { Schema, model } = require('mongoose');
const validations = require('../utils/validations'); 
const { modelName } = require('./User');


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
    image: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

module.exports = model('Company', companySchema);