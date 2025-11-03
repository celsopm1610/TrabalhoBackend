import express from "express";
import CarrinhoController from "../controles/carrinho.controller.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();


router.post("/carrinho/adicionar", verificarToken, CarrinhoController.adicionarItem);

router.delete("/carrinho/remover", verificarToken, CarrinhoController.removerItem);

router.put("/carrinho/atualizar", verificarToken, CarrinhoController.atualizarQuantidade);

router.get("/carrinho/:usuarioId", verificarToken, CarrinhoController.listar);

router.delete("/carrinho/remover/:usuarioId", verificarToken, CarrinhoController.remover);

export default router;
