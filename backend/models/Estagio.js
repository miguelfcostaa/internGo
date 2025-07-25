const { Schema, model } = require('mongoose');
const validations = require('../utils/validations');

const estagioSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    dataInicio: {
        type: String,
        required: true,
    },
    tipoEstagio: {
        type: String,
        required: true,
    },
    duracao: { // em meses
        type: Number,
        required: true,
    },
    numeroVagas: {
        type: Number,
        required: true,
    },
    localizacao:{
        type: String,
        required: true,
    },
    prazoCandidatura: {
        type: Date,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
    oportunidades: {
        type: String,
        required: true,
    },
    beneficios:{
        type: String,
        required: true,
    },
    habilitacoesMinimas: {
        type: String,
        required: true,
    },
    cursosPreferenciais: {
        type: String,
    },
    competenciasEssenciais: {
        type: String,
    },
    competenciasPessoais: {
        type: String,
    },
    idiomas: {
        type: String,
    },
    observacoes: {
        type: String,
    },
});

module.exports = model('Estagio', estagioSchema);
