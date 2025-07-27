const { Schema, model } = require('mongoose');
const validations = require('../utils/validations');

const estagioSchema = new Schema({
    title: { // Título do estágio
        type: String,
        required: true,
    },
    area: { // Área do estágio
        type: String,
        required: true,
    },
    dataInicio: { // Data de início do estágio
        type: String,
        required: true,
    },
    tipoEstagio: { // Presencial, Remoto, Híbrido
        type: String,
        required: true,
    },
    duracao: { // em meses
        type: Number,
        required: true,
    },
    numeroVagas: { // Número total de vagas disponíveis
        type: Number,
        required: true,
    },
    localizacao:{ // Localização do estágio
        type: String,
        required: true,
    },
    prazoCandidatura: { // Prazo para candidaturas
        type: Date,
        required: true,
    },
    descricao: { // Descrição do estágio
        type: String,
        required: true,
    },
    oportunidades: { // Oportunidades de desenvolvimento
        type: String,
        required: true,
    },
    beneficios:{ // Benefícios oferecidos
        type: String,
        required: true,
    },
    habilitacoesMinimas: { // Habilitações mínimas exigidas
        type: String,
        required: true,
    },
    cursosPreferenciais: { // Cursos preferenciais para o estágio
        type: String,
    },
    competenciasEssenciais: {   // Competências essenciais para o estágio
        type: String,
    },
    competenciasPessoais: { // Competências pessoais valorizadas
        type: String,
    },
    idiomas: {  // Idiomas exigidos ou valorizados
        type: String,
    },
    observacoes: { // Observações adicionais sobre o estágio
        type: String,
    },
});

module.exports = model('Estagio', estagioSchema);
