const { Schema, model } = require('mongoose');

const candidaturaSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    estagio: { 
        type: Schema.Types.ObjectId, 
        ref: 'Estagio', 
    },
    dataCandidatura: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        default: 'Pendente' 
    }
});

module.exports = model('Candidatura', candidaturaSchema);