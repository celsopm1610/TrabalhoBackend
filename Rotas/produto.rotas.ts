import express from "express";
import ProdutoController from "../controles/produto.controle.ts";

const router = express.Router();

router.post("/produtos", ProdutoController.criar);
router.get("/produtos", ProdutoController.listar);
router.get("/produtos/:id", ProdutoController.buscarPorId);
router.put("/produtos/:id", ProdutoController.atualizar);
router.delete("/produtos/:id", ProdutoController.remover);

export default router;
