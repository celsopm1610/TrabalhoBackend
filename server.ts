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
conectarBanco().then(() => {
  console.log("Conectado ao MongoDB Atlas com sucesso!");
});

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

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
