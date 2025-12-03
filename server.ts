import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { conectarBanco } from "./database/banco-mongo.js";

// Importação dos controllers/rotas
import Auth from "./Middlewares/auth.js";
import produtoRoutes from "./rotas/produto.rotas.js";
import carrinhoRoutes from "./rotas/carrinho.rota.js";
import authRoutes from "./rotas/auto.rotas.js";
import adminRoutes from "./rotas/adm.rotas.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar no MongoDB 
// Inicia a conexão com o MongoDB e só inicia o servidor após conectar
(async () => {
  try {
    await conectarBanco();
    console.log("Conectado ao MongoDB Atlas com sucesso!");

    // Iniciar servidor somente depois que o banco estiver conectado
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error("Erro ao conectar no banco, encerrando a aplicação:", err);
    process.exit(1);
  }
})();

// Rota pública 
app.use("/api/auth", authRoutes); 
app.use("/api/produtos", produtoRoutes);

// Middleware de autenticação 
app.use("/api/carrinho", Auth, carrinhoRoutes);
app.use("/api/admin", Auth, adminRoutes);

//  Rota de teste
app.get("/", (req, res) => {
  res.send("API do Brazino Records está rodando!");
});

// O servidor agora é iniciado após a conexão com o banco (ver acima).
