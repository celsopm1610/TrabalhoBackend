import express from "express";
import CarrinhoController from "../Controles/carrinho.controle.js"; 
import auth from "../Middlewares/auth.js"; 
const router = express.Router();

// Rotas de carrinho
router.post("/adicionar", CarrinhoController.adicionarItem);
router.delete("/remover", CarrinhoController.removerItem);
router.get("/", CarrinhoController.listar);
router.get("/:usuarioId", CarrinhoController.listar);
router.delete("/remover/:usuarioId", CarrinhoController.remover);

export default router;