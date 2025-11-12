import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

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

  const token = authHeader.split(" ")[1];

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      usuarioId: string;
      tipo: string;
    };

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
