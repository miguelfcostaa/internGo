const Estagio = require('../models/Estagio');
const Company = require('../models/Company');
const User = require('../models/User');
const Candidatura = require('../models/Candidatura');
const { verifyToken, verifyRole } = require('../middleware/auth');
const validations = require('../utils/validations');

// Função para criar um novo estágio
const criarEstagio = async (req, res) => {

    const errors = await validations.validateCriarEstagio(Estagio, req.body);
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: errors });
    }

    try {
        const estagioData = req.body;
        if (!estagioData) {
            return res.status(400).json({ message: 'Dados do estágio são obrigatórios' });
        }
        // Verificar se o usuário está autenticado
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        
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
        
        if (fieldName === 'area') {
            // Para o campo area que é um array, usar $elemMatch ou $in
            // 1. Busca exata pelo termo original no array
            variations.push({ [fieldName]: { $in: [term] } });
            
            // 2. Busca pelo termo normalizado (sem acentos) no array
            const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (normalized !== term) {
                variations.push({ [fieldName]: { $in: [normalized] } });
            }
            
            // 3. Busca com regex para variações de acentos no array
            const flexiblePattern = term
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                .replace(/[aáàâãä]/gi, '[aáàâãä]')
                .replace(/[eéèêë]/gi, '[eéèêë]')
                .replace(/[iíìîï]/gi, '[iíìîï]')
                .replace(/[oóòôõö]/gi, '[oóòôõö]')
                .replace(/[uúùûü]/gi, '[uúùûü]')
                .replace(/[cç]/gi, '[cç]');
                
            variations.push({ [fieldName]: { $elemMatch: { $regex: new RegExp(`^${flexiblePattern}$`, 'i') } } });
        } else {
            // Para campos string, comportamento original
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
        }
        
        // 4. Para localizações com vírgula, também fazer busca por substring (só para strings)
        if (fieldName === 'localizacao' && !term.includes(',')) {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            variations.push({ [fieldName]: { $regex: new RegExp(`^${escapedTerm}\\b`, 'i') } });
            
            const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
        const estagio = await Estagio.findById(req.params.id).populate('company', 'name email profilePhoto');
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
        const estagios = await Estagio.find(finalFilter).populate('company', 'name profilePhoto');
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
    const errors = await validations.validateCriarEstagio(Estagio, req.body);
    
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: errors });
    }


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
    if(typeof str !== 'string') return '';
    return str.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Função para obter valores únicos baseados na normalização
const getUniqueNormalizedValues = (values, isLocation = false) => {
    const seenNormalized = new Set();
    const result = [];
    
    // Primeiro, coletar todas as versões de cada valor normalizado
    const groupedValues = new Map();
    
    values.forEach(value => {
        if (value && typeof value === 'string') {
            const normalized = normalizeString(value);
            
            if (!groupedValues.has(normalized)) {
                groupedValues.set(normalized, []);
            }
            groupedValues.get(normalized).push(value);
        }
    });
    
    // Para cada grupo, escolher a melhor versão
    groupedValues.forEach((versions, normalized) => {
        if (isLocation) {
            // Para localizações, priorizar versões com vírgula (mais específicas)
            const withComma = versions.filter(v => v.includes(','));
            const withoutComma = versions.filter(v => !v.includes(','));
            
            if (withComma.length > 0) {
                // Escolher a versão com vírgula mais longa
                result.push(withComma.reduce((longest, current) => 
                    current.length > longest.length ? current : longest
                ));
            } else if (withoutComma.length > 0) {
                // Se não há versões com vírgula, escolher a mais longa sem vírgula
                result.push(withoutComma.reduce((longest, current) => 
                    current.length > longest.length ? current : longest
                ));
            }
        } else {
            // Para outros campos, priorizar versões com acentos corretos
            // Ordenar por: 1) tem acentos apropriados, 2) comprimento
            const sorted = versions.sort((a, b) => {
                // Verificar se tem acentos apropriados (diferente da versão normalizada)
                const aHasAccents = a !== normalized;
                const bHasAccents = b !== normalized;
                
                if (aHasAccents && !bHasAccents) return -1;
                if (!aHasAccents && bHasAccents) return 1;
                
                // Se ambos têm ou não têm acentos, ordenar por comprimento
                return b.length - a.length;
            });
            
            result.push(sorted[0]);
        }
    });
    
    return result.sort();
};

// Função para obter opções de filtro dinâmicas
const obterOpcoesFiltros = async (req, res) => {
    try {
        // Buscar apenas estágios ativos
        const estagiosAtivos = await Estagio.find({ status: 'Ativo' });
        
        // Extrair valores únicos para cada campo de filtro, tratando acentos como equivalentes
        // Para areas, agora é um array, então precisamos flatten os arrays
        const allAreas = estagiosAtivos.flatMap(estagio => estagio.area || []);
        const areas = getUniqueNormalizedValues(allAreas);
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

// Função para calcular similaridade de texto (simples)
const calcularSimilaridade = (texto1, texto2) => {
    if (!texto1 || !texto2) return 0;
    
    const palavras1 = texto1.toLowerCase().split(/\s+/);
    const palavras2 = texto2.toLowerCase().split(/\s+/);
    
    const palavrasComuns = palavras1.filter(palavra => 
        palavras2.some(p => p.includes(palavra) || palavra.includes(p))
    );
    
    return palavrasComuns.length / Math.max(palavras1.length, palavras2.length);
};

// Função para calcular similaridade de cursos (tratamento especial)
const calcularSimilaridadeCursos = (cursoUsuario, cursosEstagio) => {
    if (!cursoUsuario || !cursosEstagio) return 0;
    
    const cursoUsuarioLower = cursoUsuario.toLowerCase().trim();
    
    // Se cursosEstagio é um array, verificar se o curso do usuário está exatamente em um deles
    if (Array.isArray(cursosEstagio)) {
        const cursoEncontrado = cursosEstagio.some(curso => 
            curso.toLowerCase().trim() === cursoUsuarioLower
        );
        
        if (cursoEncontrado) {
            return 1.0; // Correspondência total se encontrou o curso exato
        }
        
        // Se não encontrou correspondência exata, usar similaridade normal
        const cursosString = cursosEstagio.join(' ');
        return calcularSimilaridade(cursoUsuario, cursosString);
    }
    
    // Se é string, converter para array e aplicar a mesma lógica
    const cursosArray = cursosEstagio.split(/[,;]/).map(c => c.trim());
    return calcularSimilaridadeCursos(cursoUsuario, cursosArray);
};

// Função para extrair código postal de uma localização
const extrairCodigoPostalDaLocalizacao = (localizacao) => {
    if (!localizacao) return '';
    
    // Padrões para códigos postais portugueses (XXXX-XXX ou XXXX)
    const padroes = [
        /\b(\d{4}-\d{3})\b/g,  // Formato completo: 9350-200
        /\b(\d{4})\b/g         // Formato abreviado: 9350
    ];
    
    for (const padrao of padroes) {
        const matches = localizacao.match(padrao);
        if (matches && matches.length > 0) {
            return matches[0]; // Retorna o primeiro código postal encontrado
        }
    }
    
    // Lista de códigos postais conhecidos por localização
    const codigosPostaisPorLocalidade = {
        'ribeira brava': '9350',
        'funchal': '9000',
        'lisboa': '1000',
        'porto': '4000',
        'coimbra': '3000',
        'braga': '4700',
        'faro': '8000',
        'aveiro': '3800',
        'viseu': '3500',
        'santarém': '2000',
        'leiria': '2400',
        'castelo branco': '6000',
        'bragança': '5300',
        'vila real': '5000',
        'viana do castelo': '4900',
        'setúbal': '2900',
        'évora': '7000',
        'beja': '7800',
        'portalegre': '7300',
        'guarda': '6300'
    };
    
    const localizacaoLower = localizacao.toLowerCase().trim();
    
    // Procurar por correspondência exata ou parcial
    for (const [localidade, codigo] of Object.entries(codigosPostaisPorLocalidade)) {
        if (localizacaoLower.includes(localidade) || localidade.includes(localizacaoLower)) {
            return codigo;
        }
    }
    
    return '';
};

// Função para normalizar código postal (extrair os primeiros dígitos)
const normalizarCodigoPostal = (codigoPostal) => {
    if (!codigoPostal) return '';
    return codigoPostal.split('-')[0] || codigoPostal.substring(0, 4);
};

// Função para calcular pontuação de recomendação
const calcularPontuacaoRecomendacao = (usuario, estagio) => {
    let pontuacao = 0;
    
    // 1. Correspondência de curso (peso: 30%)
    if (usuario.curso && estagio.cursosPreferenciais) {
        const cursoUsuario = usuario.curso;
        const cursosEstagio = estagio.cursosPreferenciais;
        const similaridadeCurso = calcularSimilaridadeCursos(cursoUsuario, cursosEstagio);
        pontuacao += similaridadeCurso * 30;
    }
    
    // 2. Correspondência de área com habilitações mínimas (peso: 25%)
    if (usuario.formacaoAcademica && estagio.habilitacoesMinimas) {
        const formacaoUsuario = usuario.formacaoAcademica;
        const habilitacoesEstagio = Array.isArray(estagio.habilitacoesMinimas) 
            ? estagio.habilitacoesMinimas.join(' ') 
            : estagio.habilitacoesMinimas;
        const similaridadeHabilitacoes = calcularSimilaridade(formacaoUsuario, habilitacoesEstagio);
        pontuacao += similaridadeHabilitacoes * 25;
    }
    
    // 3. Competências técnicas (peso: 25%)
    if (usuario.competenciasTecnicas && usuario.competenciasTecnicas.length > 0 && estagio.competenciasTecnicas) {
        const competenciasUsuario = Array.isArray(usuario.competenciasTecnicas) 
            ? usuario.competenciasTecnicas.join(' ') 
            : usuario.competenciasTecnicas;
        const competenciasEstagio = Array.isArray(estagio.competenciasTecnicas) 
            ? estagio.competenciasTecnicas.join(' ') 
            : estagio.competenciasTecnicas;
        const similaridadeCompetencias = calcularSimilaridade(competenciasUsuario, competenciasEstagio);
        pontuacao += similaridadeCompetencias * 25;
    }
    
    // 4. Proximidade geográfica (peso: 15%)
    if (usuario.codigoPostal && estagio.localizacao) {
        const cpUsuario = normalizarCodigoPostal(usuario.codigoPostal);
        const cpEstagio = extrairCodigoPostalDaLocalizacao(estagio.localizacao);
        const cpEstagioNormalizado = normalizarCodigoPostal(cpEstagio);
        
        if (cpUsuario && cpEstagioNormalizado) {
            if (cpUsuario === cpEstagioNormalizado) {
                pontuacao += 15; // Correspondência exata de código postal
            } else {
                // Verificar proximidade (primeiros 3 dígitos)
                const cpUsuarioParcial = cpUsuario.substring(0, 3);
                const cpEstagioParcial = cpEstagioNormalizado.substring(0, 3);
                
                if (cpUsuarioParcial === cpEstagioParcial) {
                    pontuacao += 7; // Correspondência parcial de código postal
                }
            }
        }
    }
    
    // 5. Bonificação para estágios remotos (peso: 5%)
    if (estagio.tipoEstagio && estagio.tipoEstagio.toLowerCase().includes('remoto')) {
        pontuacao += 5;
    }
    
    return Math.min(pontuacao, 100); // Máximo de 100 pontos
};

// Função para obter estágios recomendados baseado no perfil do usuário
const obterEstagiosRecomendados = async (req, res) => {
    try {
        const userId = req.user.id;
        const limite = parseInt(req.query.limite) || 10; // Limite padrão de 10 recomendações
        
        // Obter o usuário
        const usuario = await User.findById(userId);
        
        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        // Obter candidaturas do usuário para excluir estágios já candidatados
        const candidaturas = await Candidatura.find({ user: userId });
        const idsEstagiosCandidatados = candidaturas.map(c => c.estagio.toString());
        
        // Buscar todos os estágios ativos (exceto os já candidatados)
        const estagiosDisponiveis = await Estagio.find({
            _id: { $nin: idsEstagiosCandidatados },
            status: 'Ativo',
            prazoCandidatura: { $gte: new Date() } // Prazo ainda válido
        }).populate('company', 'name');
        
        // Calcular pontuação para cada estágio
        const estagiosComPontuacao = estagiosDisponiveis.map(estagio => ({
            ...estagio.toObject(),
            pontuacaoRecomendacao: calcularPontuacaoRecomendacao(usuario, estagio)
        }));
        
        // Ordenar por pontuação (decrescente) e limitar resultados
        const estagiosRecomendados = estagiosComPontuacao
            .sort((a, b) => b.pontuacaoRecomendacao - a.pontuacaoRecomendacao)
            .slice(0, limite);
        
        res.json({
            message: 'Estágios recomendados obtidos com sucesso',
            total: estagiosRecomendados.length,
            estagios: estagiosRecomendados,
            criterios: {
                curso: usuario.curso,
                formacaoAcademica: usuario.formacaoAcademica,
                competenciasTecnicas: usuario.competenciasTecnicas,
                codigoPostal: usuario.codigoPostal
            }
        });
    } catch (error) {
        console.error('Erro ao obter estágios recomendados:', error);
        res.status(500).json({ message: 'Erro ao obter estágios recomendados', error: error.message });
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
    buscarEstagios,
    obterEstagiosRecomendados
};