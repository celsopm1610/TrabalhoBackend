import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarBanco } from "./database/banco-mongo.js";

// Importar rotas
import authRotas from "./rotas/auth.rotas.js";
import produtoRotas from "./rotas/produto.rotas.js";
import carrinhoRotas from "./rotas/carrinho.rotas.js";
import admRotas from "./rotas/adm.rotas.js";

dotenv.config(); // Carrega variáveis de ambiente (.env)

const app = express();

// Configurações básicas
app.use(cors());
app.use(express.json());

// Conexão com o banco
conectarBanco()
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar no banco:", err));

// Registrar rotas
app.use(authRotas);
app.use(produtoRotas);
app.use(carrinhoRotas);
app.use(admRotas);

// Rota base
app.get("/", (req, res) => {
  res.send("🎵 API da Loja de Álbuns está online!");
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando em http://localhost:${PORT}`));
