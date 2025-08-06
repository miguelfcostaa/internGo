const { Schema, model } = require('mongoose');

const estagioSchema = new Schema({
    status: {
        type: String,
        default: 'Ativo',
    },
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
    prazoCandidatura: { // Prazo para candidaturas 2025-00-00
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
        type: Array,
        required: true,
    },
    habilitacoesMinimas: { // Habilitações mínimas exigidas
        type: String,
        required: true,
    },
    cursosPreferenciais: { // Cursos preferenciais para o estágio
        type: String,
    },
    competenciasTecnicas: {   // Competências técnicas para o estágio
        type: Array,
    },
    competenciasPessoais: { // Competências pessoais valorizadas
        type: Array,
    },
    idiomas: {  // Idiomas exigidos ou valorizados
        type: Array,
    },
    observacoes: { // Observações adicionais sobre o estágio
        type: String,
    },
    company: { // Referência à empresa que oferece o estágio
        type: Schema.Types.ObjectId,
        ref: 'Company',
    },
    horaInicio: { // Hora de início do estágio
        type: String,
    },
    horaFim: { // Hora de fim do estágio
        type: String,
    },
});

module.exports = model('Estagio', estagioSchema);
