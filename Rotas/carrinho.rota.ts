import express from "express";
import CarrinhoController from "../controles/carrinho.controle.ts";
import auth from "../Middlewares/auth.ts";

const router = express.Router();


router.post("/carrinho/adicionar", auth, CarrinhoController.adicionarItem);

router.delete("/carrinho/remover", auth, CarrinhoController.removerItem);

router.get("/carrinho/:usuarioId", auth, CarrinhoController.listar);

router.delete("/carrinho/remover/:usuarioId", auth, CarrinhoController.remover);

export default router;
