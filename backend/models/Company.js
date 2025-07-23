import { Schema, model } from 'mongoose';
import validations from '../utils/validations.js';
import { validate } from './User';

const companySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validations.validateName,
            message: 'Nome da empresa deve ter entre 3 e 50 caracteres.'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validations.validateEmail,
            message: 'Email deve ter formato válido.'
        }
    },
    password: {
        required: true,
        validate: {
            validator: validations.validatePassword,
            message: 'Password deve ter pelo menos 8 caracteres.'
        }
    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: validations.validatePhoneNumber, 
            message: 'Número de telefone deve ter formato válido (9xxxxxxxx ou +351xxxxxxxxx).'
        }
    },
    nif: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validations.validateNIF, 
            message: 'NIF deve ter exatamente 9 dígitos.'
        }
    },
    image: {
        type: String,
        required: false,
    }
});

const Company = model('Company', companySchema);
export default Company;
    