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
        const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // 1. Busca exata pelo termo original
        variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}$`, 'i') } });
        
        // 2. Busca pelo termo normalizado (sem acentos)
        const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (normalized !== term) {
            const escapedNormalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedNormalized}$`, 'i') } });
        }
        
        // 3. Busca com variações de acentos (funciona para ambos os sentidos)
        const flexiblePattern = term
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            .replace(/[aáàâãä]/gi, '[aáàâãä]')
            .replace(/[eéèêë]/gi, '[eéèêë]')
            .replace(/[iíìîï]/gi, '[iíìîï]')
            .replace(/[oóòôõö]/gi, '[oóòôõö]')
            .replace(/[uúùûü]/gi, '[uúùûü]')
            .replace(/[cç]/gi, '[cç]');
            
        variations.push({ [fieldName]: { $regex: new RegExp(`^${flexiblePattern}$`, 'i') } });
        
        // 4. Para localizações com vírgula, também fazer busca por substring
        if (fieldName === 'localizacao' && !term.includes(',')) {
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}\\b`, 'i') } });
            if (normalized !== term) {
                const escapedNormalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedNormalized}\\b`, 'i') } });
            }
        }
    });
    
    return { $or: variations };
};

// Função para obter um estágio por ID
const obterEstagioById = async (req, res) => {
    try {
        const estagio = await Estagio.findById(req.params.id).populate('company', 'name email');
        if (!estagio) {
            return res.status(404).json({ message: 'Estágio não encontrado' });
        }
        res.json(estagio);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar estágio', error });
    }
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
const getUniqueNormalizedValues = (values, isLocation = false) => {
    const seen = new Map();
    const processedValues = [];
    
    values.forEach(value => {
        if (value) {
            const normalized = normalizeString(value);
            
            if (isLocation) {
                // Para localizações, dar prioridade à versão mais específica (com vírgula)
                const existingEntry = Array.from(seen.entries()).find(([key, val]) => {
                    const currentNorm = normalizeString(val);
                    // Verificar se uma é substring da outra
                    return currentNorm.includes(normalized) || normalized.includes(currentNorm);
                });
                
                if (existingEntry) {
                    const [existingKey, existingValue] = existingEntry;
                    // Manter a versão mais específica (normalmente a que tem vírgula)
                    if (value.includes(',') && !existingValue.includes(',')) {
                        // Substituir pela versão mais específica
                        seen.delete(existingKey);
                        seen.set(normalized, value);
                    } else if (!value.includes(',') && existingValue.includes(',')) {
                        // Manter a versão mais específica que já existe
                        return;
                    } else if (value.length > existingValue.length) {
                        // Se ambas têm ou não têm vírgula, manter a mais longa
                        seen.delete(existingKey);
                        seen.set(normalized, value);
                    }
                } else {
                    seen.set(normalized, value);
                }
            } else {
                // Para outros campos, comportamento normal
                if (!seen.has(normalized)) {
                    seen.set(normalized, value);
                }
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
        const localizacoes = getUniqueNormalizedValues(estagiosAtivos.map(estagio => estagio.localizacao), true);
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

// Função para buscar estágios por nome da empresa ou título do estágio (para NavBar)
const buscarEstagios = async (req, res) => {
    try {
        const { q } = req.query; // termo de busca
        
        if (!q || q.trim() === '') {
            return res.json([]);
        }

        const termoBusca = q.trim();
        
        // Criar padrão regex insensível a acentos
        const createSearchPattern = (term) => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const flexiblePattern = escapedTerm
                .replace(/[aáàâãä]/gi, '[aáàâãä]')
                .replace(/[eéèêë]/gi, '[eéèêë]')
                .replace(/[iíìîï]/gi, '[iíìîï]')
                .replace(/[oóòôõö]/gi, '[oóòôõö]')
                .replace(/[uúùûü]/gi, '[uúùûü]')
                .replace(/[cç]/gi, '[cç]');
            return new RegExp(flexiblePattern, 'i');
        };

        const searchPattern = createSearchPattern(termoBusca);

        // Buscar estágios ativos por título do estágio
        const estagiosPorTitulo = await Estagio.find({
            status: 'Ativo',
            title: { $regex: searchPattern }
        }).populate('company', 'name');

        // Buscar estágios ativos por nome da empresa
        const empresas = await Company.find({
            name: { $regex: searchPattern }
        }).select('_id');

        const empresaIds = empresas.map(empresa => empresa._id);
        
        const estagiosPorEmpresa = await Estagio.find({
            status: 'Ativo',
            company: { $in: empresaIds }
        }).populate('company', 'name');

        // Combinar resultados e remover duplicados
        const todosEstagios = [...estagiosPorTitulo, ...estagiosPorEmpresa];
        const estagiosUnicos = todosEstagios.filter((estagio, index, self) => 
            index === self.findIndex(e => e._id.toString() === estagio._id.toString())
        );

        res.json(estagiosUnicos);
    } catch (error) {
        console.error('Erro ao buscar estágios:', error);
        res.status(500).json({ message: 'Erro ao buscar estágios', error: error.message });
    }
};

module.exports = {
    criarEstagio,
    obterEstagios,
    obterEstagioById,
    obterEstagiosPorEmpresa,
    obterEstagio,
    contarEstagios,
    alterarEstadoEstagio,
    atualizarEstagio,
    deletarEstagio,
    obterOpcoesFiltros,
    buscarEstagios
};