import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// Interface para estender o Request do Express
interface AutenticacaoRequest extends Request {
  usuarioId?: string;
  tipo?: string; 
}

function Auth(req: AutenticacaoRequest, res: Response, next: NextFunction) {
  console.log("Passando pelo middleware de autenticação...");

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Você não passou o token no Bearer" });
  }

  // Pega o token após o "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensagem: "Token não fornecido" });
  }

  // Fallback de segurança para o segredo
  const secretKey = process.env.JWT_SECRET || "Musica";

  try {
    // Decodifica e força a tipagem do retorno
    const decoded = jwt.verify(token, secretKey) as unknown as {
      usuarioId: string;
      tipo: string;
    };

    // Anexa os dados ao request para uso nas próximas rotas
    req.usuarioId = decoded.usuarioId;
    req.tipo = decoded.tipo;

    console.log("Token válido para usuário:", decoded.usuarioId);
    next(); 
  } catch (erro) {
    console.error("❌ Erro ao verificar token:", erro);
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
}

export default Auth;