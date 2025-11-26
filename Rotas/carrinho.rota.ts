import express from "express";
import CarrinhoController from "../controles/carrinho.controle.ts";
import auth from "../Middlewares/auth.ts";

const router = express.Router();

// Rotas de carrinho (o middleware de autenticação é aplicado em server.ts)
router.post("/adicionar", CarrinhoController.adicionarItem);
router.delete("/remover", CarrinhoController.removerItem);
// Nova rota: GET /api/carrinho -> usa usuarioId extraído do token
router.get("/", CarrinhoController.listar);
// Mantemos compatibilidade com rota antiga que recebe :usuarioId
router.get("/:usuarioId", CarrinhoController.listar);
router.delete("/remover/:usuarioId", CarrinhoController.remover);

export default router;