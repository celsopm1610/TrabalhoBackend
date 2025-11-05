import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarBanco } from "./database/banco-mongo.js";

// Importação dos controllers/rotas
import Auth from "./Middlewares/auth.ts";
import produtoRoutes from "./Rotas/produto.rotas.ts";
import carrinhoRoutes from "./Rotas/carrinho.rota.ts";
import authRoutes from "./rotas/auto.rotas.ts";
import adminRoutes from "./rotas/adm.rotas.ts";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao banco MongoDB Atlas
conectarBanco().then(() => {
  console.log("🎵 Conectado ao MongoDB Atlas com sucesso!");
});

// 🚀 Rota pública (sem login)
app.use("/api/auth", authRoutes); 
app.use("/api/produtos", produtoRoutes); // visitante pode ver produtos

// 🧱 Middleware de autenticação (a partir daqui tudo é protegido)
app.use("/api/carrinho", Auth, carrinhoRoutes);
app.use("/api/admin", Auth, adminRoutes);

//  Rota de teste
app.get("/", (req, res) => {
  res.send("🚀 API da Loja de Álbuns está rodando!");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
