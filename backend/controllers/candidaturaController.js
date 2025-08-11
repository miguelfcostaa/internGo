const Candidatura = require("../models/Candidatura");
const Estagio = require("../models/Estagio");
const User = require("../models/User");
const validations = require("../utils/validations");

// Buscar todas as candidaturas
const getAllCandidaturas = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find()
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name" },
      })
      .populate("user");

    res.json(candidaturas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar candidaturas", error: error.message });
  }
};

// Buscar candidatura por ID
const getCandidaturaById = async (req, res) => {
  try {
    const candidatura = await Candidatura.findById(req.params.candidaturaId)
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name" },
      })
      .populate("user");

    if (!candidatura) {
      return res.status(404).json({ message: "Candidatura não encontrada." });
    }

    // Adicionar o nome do arquivo do CV à resposta
    const candidaturaResponse = candidatura.toObject();
    candidaturaResponse.cv = candidatura.user.cv;

    res.json(candidaturaResponse);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar candidatura", error: error.message });
  }
};

// Buscar candidaturas de uma empresa
const getCandidaturasByCompany = async (req, res) => {
  try {
    // Buscar todos os estágios da empresa
    const estagios = await Estagio.find({
      company: req.params.companyId,
    }).select("_id");
    const estagioIds = estagios.map((e) => e._id);

    // Buscar candidaturas desses estágios
    const candidaturas = await Candidatura.find({
      estagio: { $in: estagioIds },
    })
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name" },
      })
      .populate("user");

    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar candidaturas da empresa",
      error: error.message,
    });
  }
};

// Buscar candidaturas de um usuário
const getCandidaturasByUser = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({
      user: req.params.userId,
    }).populate({
      path: "estagio",
      populate: { path: "company", select: "name" },
    });

    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar candidaturas do usuário",
      error: error.message,
    });
  }
};

// Buscar candidaturas de um estágio
const getCandidaturasByEstagio = async (req, res) => {
  try {
    const candidaturas = await Candidatura.find({
      estagio: req.params.estagioId,
    })
      .populate("user")
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name" },
      });

    res.json(candidaturas);
  } catch (error) {
    res.status(500).json({
      message: "Erro ao buscar candidaturas do estágio",
      error: error.message,
    });
  }
};

// Criar candidatura
const createCandidatura = async (req, res) => {
  try {
    // Validar dados de entrada
    const errors = await validations.validateCandidatura(req.body, req.file);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: errors });
    }

    const estagioId = req.params.estagioId;
    const userId = req.user.id;

    // Verificar se o usuário é uma empresa
    if (req.user.role === "company") {
      return res.status(403).json({
        message:
          "Empresas não podem candidatar-se aos estágios. Apenas estudantes podem candidatar-se.",
      });
    }

    // Verificar se o usuário é um estudante
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Apenas estudantes podem candidatar-se aos estágios.",
      });
    }

    // Verificar se já existe candidatura
    const candidaturaExistente = await Candidatura.findOne({
      user: userId,
      estagio: estagioId,
    });

    if (candidaturaExistente) {
      return res
        .status(400)
        .json({ message: "Já se candidatou a este estágio." });
    }

    // Verificar se o estágio existe
    const estagio = await Estagio.findById(estagioId);
    if (!estagio) {
      return res.status(404).json({ message: "Estágio não encontrado." });
    }

    // Verificar o cv
    let cvPath = null;
    if (req.file) {
      // Extrair apenas o nome do arquivo do caminho completo
      cvPath = req.file.filename;
      
      // Atualizar o CV do usuário
      await User.findByIdAndUpdate(userId, { cv: cvPath });
    }

    // Criar candidatura
    const novaCandidatura = new Candidatura({
      user: userId,
      estagio: estagioId,
    });

    await novaCandidatura.save();

    // Retornar candidatura com dados populados
    const candidaturaCompleta = await Candidatura.findById(novaCandidatura._id)
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name" },
      })
      .populate("user");

    res.status(201).json({
      success: true,
      message: "Candidatura criada com sucesso!",
      candidatura: candidaturaCompleta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao criar candidatura",
      error: error.message,
    });
  }
};

// Aceitar candidatura
const aceitarCandidatura = async (req, res) => {
  try {
    const { candidaturaId } = req.params;

    // Verificar se o usuário é uma empresa
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Apenas empresas podem aceitar candidaturas.",
      });
    }

    // Buscar a candidatura
    const candidatura = await Candidatura.findById(candidaturaId)
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name _id" },
      })
      .populate("user", "name email");

    if (!candidatura) {
      return res.status(404).json({ message: "Candidatura não encontrada." });
    }

    // Verificar se o estágio existe e tem empresa associada
    if (!candidatura.estagio || !candidatura.estagio.company) {
      return res.status(400).json({
        message: "Estágio ou empresa não encontrados.",
      });
    }

    // Verificar se a empresa é dona do estágio - usar toString() em ambos os IDs
    const empresaEstagio = candidatura.estagio.company._id.toString();
    const empresaLogada = req.user.id.toString();

    if (empresaEstagio !== empresaLogada) {
      return res.status(403).json({
        message: "Você não tem permissão para aceitar esta candidatura.",
        debug: {
          empresaEstagio,
          empresaLogada,
          match: empresaEstagio === empresaLogada,
        },
      });
    }

    // Verificar se a candidatura já foi processada
    if (candidatura.status !== "Pendente") {
      return res.status(400).json({
        message: `Esta candidatura já foi ${candidatura.status}.`,
      });
    }

    // Aceitar a candidatura
    candidatura.status = "Aceite";
    candidatura.dataResposta = new Date();
    await candidatura.save();

    res.json({
      success: true,
      message: "Candidatura aceite com sucesso!",
      candidatura,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao aceitar candidatura",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Recusar candidatura
const recusarCandidatura = async (req, res) => {
  try {
    const { candidaturaId } = req.params;
    const { motivo } = req.body;

    // Validar motivo de recusa se fornecido
    if (motivo) {
      const motivoError = validations.validateMotivoRecusa(motivo);
      if (motivoError) {
        return res.status(400).json({ message: motivoError });
      }
    }

    // Verificar se o usuário é uma empresa
    if (req.user.role !== "company") {
      return res.status(403).json({
        message: "Apenas empresas podem recusar candidaturas.",
      });
    }

    // Buscar a candidatura
    const candidatura = await Candidatura.findById(candidaturaId)
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name _id" },
      })
      .populate("user", "name email");

    if (!candidatura) {
      return res.status(404).json({ message: "Candidatura não encontrada." });
    }

    // Verificar se o estágio existe e tem empresa associada
    if (!candidatura.estagio || !candidatura.estagio.company) {
      return res.status(400).json({
        message: "Estágio ou empresa não encontrados.",
      });
    }

    // Verificar se a empresa é dona do estágio - usar toString() em ambos os IDs
    const empresaEstagio = candidatura.estagio.company._id.toString();
    const empresaLogada = req.user.id.toString();

    if (empresaEstagio !== empresaLogada) {
      return res.status(403).json({
        message: "Você não tem permissão para recusar esta candidatura.",
        debug: {
          empresaEstagio,
          empresaLogada,
          match: empresaEstagio === empresaLogada,
        },
      });
    }

    // Verificar se a candidatura já foi processada
    if (candidatura.status !== "Pendente") {
      return res.status(400).json({
        message: `Esta candidatura já foi ${candidatura.status}.`,
      });
    }

    // Recusar a candidatura
    candidatura.status = "Recusada";
    candidatura.dataResposta = new Date();
    if (motivo) {
      candidatura.motivoRecusa = motivo;
    }
    await candidatura.save();

    res.json({
      success: true,
      message: "Candidatura recusada com sucesso!",
      candidatura,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao recusar candidatura",
      error: error.message,
      stack: error.stack,
    });
  }
};

// Função de debug para testar candidaturas
const debugCandidatura = async (req, res) => {
  try {
    const { candidaturaId } = req.params;

    // Buscar a candidatura com todos os detalhes
    const candidatura = await Candidatura.findById(candidaturaId)
      .populate({
        path: "estagio",
        populate: { path: "company", select: "name _id email" },
      })
      .populate("user", "name email");

    if (!candidatura) {
      return res.status(404).json({ message: "Candidatura não encontrada." });
    }

    // Informações de debug
    const debug = {
      candidatura: {
        id: candidatura._id,
        status: candidatura.status,
        dataCandidatura: candidatura.dataCandidatura,
      },
      estagio: {
        id: candidatura.estagio._id,
        title: candidatura.estagio.title,
        company: candidatura.estagio.company,
      },
      user: candidatura.user,
      requestUser: {
        id: req.user.id,
        role: req.user.role,
      },
      comparacao: {
        empresaEstagio: candidatura.estagio.company._id.toString(),
        empresaLogada: req.user.id.toString(),
        saoIguais:
          candidatura.estagio.company._id.toString() === req.user.id.toString(),
      },
    };

    res.json({
      success: true,
      message: "Debug da candidatura",
      debug,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro no debug",
      error: error.message,
      stack: error.stack,
    });
  }
};

module.exports = {
  getAllCandidaturas,
  getCandidaturaById,
  getCandidaturasByCompany,
  getCandidaturasByUser,
  getCandidaturasByEstagio,
  createCandidatura,
  aceitarCandidatura,
  recusarCandidatura,
  debugCandidatura,
};
