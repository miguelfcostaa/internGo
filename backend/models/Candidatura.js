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
        required: true 
    },
    dataCandidatura: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['Pendente', 'Aceite', 'Recusada'],
        default: 'Pendente' 
    },
    dataResposta: {
        type: Date
    },
    motivoRecusa: {
        type: String
    }
});

module.exports = model('Candidatura', candidaturaSchema);