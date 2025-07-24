const jwt = require("jsonwebtoken");
const User = require("../models/User");
//ver amanha
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token não fornecido ou formato inválido",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar o usuário no banco
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Adicionar o usuário ao request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expirado",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }

  function verifyRole(role) {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Token em falta" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.role !== role) {
                return res.status(403).json({ message: "Acesso proibido" });
            }
              req.user = decoded;
              next();
          } catch (error) {
              res.status(401).json({ message: "Token inválido" });
          }
      };
  }
};

module.exports = { verifyToken, verifyRole };