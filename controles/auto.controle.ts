import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../database/banco-mongo.js";

const JWT_SECRET = "segredo_super_seguro"; // Ideal guardar em variável de ambiente (.env)

interface Usuario {
  _id?: string;
  nome: string;
  email: string;
  senha: string;
  tipo: "admin" | "usuario";
}

class AuthController {
  // Registrar usuário
  async registrar(req: Request, res: Response) {
    try {
      const { nome, email, senha, tipo } = req.body;

      if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Preencha todos os campos obrigatórios." });
      }

      // Verifica se já existe o email cadastrado
      const usuarioExistente = await db.collection<Usuario>("usuarios").findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
      }

      // Criptografa a senha
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      // Define tipo de usuário
      const novoUsuario: Usuario = {
        nome,
        email,
        senha: senhaCriptografada,
        tipo: tipo === "admin" ? "admin" : "usuario"
      };

      await db.collection("usuarios").insertOne(novoUsuario);
      return res.status(201).json({ mensagem: "Usuário registrado com sucesso!" });
    } catch (erro) {
      console.error("Erro ao registrar:", erro);
      return res.status(500).json({ mensagem: "Erro interno ao registrar usuário." });
    }
  }

  // Login
  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ mensagem: "Informe o email e a senha." });
      }

      const usuario = await db.collection<Usuario>("usuarios").findOne({ email });
      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado." });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ mensagem: "Senha incorreta." });
      }

      // Gera o token JWT
      const token = jwt.sign(
        {
          id: usuario._id,
          nome: usuario.nome,
          tipo: usuario.tipo
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        mensagem: "Login realizado com sucesso!",
        token,
        usuario: { nome: usuario.nome, tipo: usuario.tipo }
      });
    } catch (erro) {
      console.error("Erro ao fazer login:", erro);
      return res.status(500).json({ mensagem: "Erro interno ao fazer login." });
    }
  }

  // Validar token
  async validarToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ mensagem: "Token não fornecido." });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      return res.status(200).json({ valido: true, dados: decoded });
    } catch (erro) {
      return res.status(401).json({ valido: false, mensagem: "Token inválido ou expirado." });
    }
  }
}

export default new AuthController();
