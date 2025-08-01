const Estagio = require('../models/Estagio');
const Company = require('../models/Company');
const { verifyToken, verifyRole } = require('../middleware/auth');

// Função para criar um novo estágio
const criarEstagio = async (req, res) => {
    try {
        const estagioData = req.body;
        
        // Verificar se o usuário é uma empresa
        const company = await Company.findById(req.user.id);
        if (!company) {
            return res.status(404).json({ message: 'Empresa não encontrada' });
        }
        
        // Adicionar a referência da empresa ao estágio
        estagioData.company = req.user.id;

        const novoEstagio = new Estagio(estagioData);
        await novoEstagio.save();
        
        res.status(201).json({
            message: 'Estágio criado com sucesso!',
            estagio: novoEstagio
        });
    } catch (error) {
        console.error('Erro ao criar estágio:', error);
        res.status(400).json({ 
            message: 'Erro ao criar estágio', 
            error: error.message 
        });
    }
};

// Função para criar busca insensível a acentos usando $or com variações
const createAccentInsensitiveFilter = (fieldName, searchTerms) => {
    const variations = [];
    
    searchTerms.forEach(term => {
        // Lógica especial baseada no tipo de termo
        if (term.includes(',')) {
            // Para termos com vírgula (como "Ribeira Brava, Madeira"): apenas busca exata
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Busca exata
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}$`, 'i') } });
            
            // Busca exata sem acentos
            const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalized !== term) {
                const escapedNormalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedNormalized}$`, 'i') } });
            }
            
            // Busca exata com variações de acentos
            const flexiblePattern = term
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                .replace(/a/gi, '[aáàâãä]')
                .replace(/e/gi, '[eéèêë]')
                .replace(/i/gi, '[iíìîï]')
                .replace(/o/gi, '[oóòôõö]')
                .replace(/u/gi, '[uúùûü]')
                .replace(/c/gi, '[cç]');
                
            variations.push({ [fieldName]: { $regex: new RegExp(`^${flexiblePattern}$`, 'i') } });
            
        } else {
            // Para termos sem vírgula (como "Ribeira Brava"): busca exata + substring
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            // Busca exata
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}$`, 'i') } });
            
            // Busca por substring (para encontrar "Ribeira Brava" em "Ribeira Brava, Madeira")
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}\\b`, 'i') } }); // Word boundary
            
            // Busca exata sem acentos
            const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalized !== term) {
                const escapedNormalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedNormalized}$`, 'i') } });
                variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedNormalized}\\b`, 'i') } });
            }
        }
    });
    
    return { $or: variations };
};

// Função para obter todos os estágios
const obterEstagios = async (req, res) => {
    try {
        const filtros = {
            status: 'Ativo' // Só mostrar estágios ativos na homepage
        };

        const andConditions = [filtros];

        if (req.query.area) {
            const areas = Array.isArray(req.query.area) ? req.query.area : req.query.area.split(',');
            andConditions.push(createAccentInsensitiveFilter('area', areas));
        }
        if (req.query.localizacao) {
            const localizacoes = Array.isArray(req.query.localizacao) ? req.query.localizacao : req.query.localizacao.split(',');
            andConditions.push(createAccentInsensitiveFilter('localizacao', localizacoes));
        }
        if (req.query.duracao) {
            const duracoes = Array.isArray(req.query.duracao) ? req.query.duracao : req.query.duracao.split(',');
            filtros.duracao = { $in: duracoes.map(d => parseInt(d)) };
        }
        if (req.query.tipoEstagio) {
            const tipos = Array.isArray(req.query.tipoEstagio) ? req.query.tipoEstagio : req.query.tipoEstagio.split(',');
            andConditions.push(createAccentInsensitiveFilter('tipoEstagio', tipos));
        }

        const finalFilter = andConditions.length > 1 ? { $and: andConditions } : filtros;
        const estagios = await Estagio.find(finalFilter).populate('company', 'name');
        res.json(estagios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágios', error });
    }
};

// Função para obter estágios por empresa
const obterEstagiosPorEmpresa = async (req, res) => {
    try {
        const estagios = await Estagio.find({ company: req.params.companyId });
        res.json(estagios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágios da empresa', error });
    }
};

// Função para obter um estágio específico
const obterEstagio = async (req, res) => {
    try {
        const estagio = await Estagio.findById(req.params.id);
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json(estagio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágio', error });
    }
};

// Função para contar estágios de uma empresa
const contarEstagios = async (req, res) => {
    try {
        const nEstagios = await Estagio.countDocuments({ company: req.params.companyId });
        res.json({ nEstagios });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao contar estágios', error });
    }
};

// Função para alterar estado do estágio
const alterarEstadoEstagio = async (req, res) => {
    try {
        const estagio = await Estagio.findById(req.params.id);
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        estagio.status = req.body.status || (estagio.status === 'Ativo' ? 'Inativo' : 'Ativo');
        await estagio.save();
        res.json(estagio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao alterar estado do estágio', error });
    }
};

// Função para atualizar um estágio
const atualizarEstagio = async (req, res) => {
    try {
        const estagioId = req.params.id;
        const estagioData = req.body;
        
        // Verificar se o estágio existe
        const estagio = await Estagio.findById(estagioId);
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        
        console.log('Estágio encontrado:', {
            id: estagio._id,
            company: estagio.company,
            userLoggedId: req.user.id
        });
        
        // Verificar se o usuário é o dono do estágio (converter ambos para string para comparação)
        const estagioCompanyId = estagio.company ? estagio.company.toString() : null;
        const userLoggedId = req.user.id ? req.user.id.toString() : null;
        
        console.log('Comparação de autorização:', {
            estagioCompany: estagioCompanyId,
            userLoggedId: userLoggedId,
            userRole: req.user.role,
            saoIguais: estagioCompanyId === userLoggedId
        });
        
        // Verificar se o usuário é uma empresa e se é o dono do estágio
        if (req.user.role !== 'company') {
            return res.status(403).json({ 
                message: 'Apenas empresas podem editar estágios' 
            });
        }
        
        if (!estagioCompanyId || !userLoggedId || estagioCompanyId !== userLoggedId) {
            return res.status(403).json({ 
                message: 'Não autorizado a editar este estágio',
                debug: {
                    estagioCompany: estagioCompanyId,
                    userLoggedId: userLoggedId,
                    userRole: req.user.role
                }
            });
        }
        
        // Atualizar o estágio
        const estagioAtualizado = await Estagio.findByIdAndUpdate(
            estagioId,
            estagioData,
            { new: true, runValidators: true }
        );
        
        res.json({
            message: 'Estágio atualizado com sucesso!',
            estagio: estagioAtualizado
        });
    } catch (error) {
        console.error('Erro ao atualizar estágio:', error);
        res.status(400).json({ 
            message: 'Erro ao atualizar estágio', 
            error: error.message 
        });
    }
};

// Função para deletar um estágio
const deletarEstagio = async (req, res) => {
    try {
        const estagioId = req.params.id;
        
        // Verificar se o estágio existe
        const estagio = await Estagio.findById(estagioId);
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        
        // Verificar se o usuário é uma empresa e se é o dono do estágio
        if (req.user.role !== 'company') {
            return res.status(403).json({ 
                message: 'Apenas empresas podem deletar estágios' 
            });
        }
        
        const estagioCompanyId = estagio.company ? estagio.company.toString() : null;
        const userLoggedId = req.user.id ? req.user.id.toString() : null;
        
        if (!estagioCompanyId || !userLoggedId || estagioCompanyId !== userLoggedId) {
            return res.status(403).json({ 
                message: 'Não autorizado a deletar este estágio' 
            });
        }
        
        // Deletar o estágio
        await Estagio.findByIdAndDelete(estagioId);
        
        res.json({
            message: 'Estágio deletado com sucesso!'
        });
    } catch (error) {
        console.error('Erro ao deletar estágio:', error);
        res.status(400).json({ 
            message: 'Erro ao deletar estágio', 
            error: error.message 
        });
    }
};

// Função para normalizar strings removendo acentos e convertendo para lowercase
const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Função para obter valores únicos baseados na normalização
const getUniqueNormalizedValues = (values) => {
    const seen = new Map();
    
    values.forEach(value => {
        if (value) {
            const normalized = normalizeString(value);
            if (!seen.has(normalized)) {
                seen.set(normalized, value);
            }
        }
    });
    
    return Array.from(seen.values()).sort();
};

// Função para obter opções de filtro dinâmicas
const obterOpcoesFiltros = async (req, res) => {
    try {
        // Buscar apenas estágios ativos
        const estagiosAtivos = await Estagio.find({ status: 'Ativo' });
        
        // Extrair valores únicos para cada campo de filtro, tratando acentos como equivalentes
        const areas = getUniqueNormalizedValues(estagiosAtivos.map(estagio => estagio.area));
        const localizacoes = getUniqueNormalizedValues(estagiosAtivos.map(estagio => estagio.localizacao));
        const duracoes = [...new Set(estagiosAtivos.map(estagio => estagio.duracao))].filter(Boolean).sort((a, b) => a - b);
        const tiposEstagio = getUniqueNormalizedValues(estagiosAtivos.map(estagio => estagio.tipoEstagio));
        
        res.json({
            area: areas,
            localizacao: localizacoes,
            duracao: duracoes,
            tipoEstagio: tiposEstagio
        });
    } catch (error) {
        console.error('Erro ao obter opções de filtros:', error);
        res.status(500).json({ 
            message: 'Erro ao obter opções de filtros', 
            error: error.message 
        });
    }
};

module.exports = {
    criarEstagio,
    obterEstagios,
    obterEstagiosPorEmpresa,
    obterEstagio,
    contarEstagios,
    alterarEstadoEstagio,
    atualizarEstagio,
    deletarEstagio,
    obterOpcoesFiltros
};