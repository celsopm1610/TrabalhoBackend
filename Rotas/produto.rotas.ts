import express from "express";
import ProdutoController from "../Controles/produto.controle.js"; 

const router = express.Router();

router.post("/", ProdutoController.criar);
router.get("/", ProdutoController.listar);
router.get("/:id", ProdutoController.buscarPorId);
router.put("/:id", ProdutoController.atualizar);
router.delete("/:id", ProdutoController.remover);

export default router;