const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Company = require("../models/Company");
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
		const decoded = jwt.verify(token, process.env.JWT_SECRET);


		let account;

		if (decoded.role === "company") {
			account = await Company.findById(decoded.id);
		} else if (decoded.role === "user") {
			account = await User.findById(decoded.id);
		}

		if (!account) {
			return res.status(404).json({ message: "Conta não encontrada", "Decoded JWT": decoded });
		}

		req.user = {
			id: account._id,
			role: decoded.role,
		};

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
};
  
const verifyRole = (role) => {
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
};

module.exports = { verifyToken, verifyRole };