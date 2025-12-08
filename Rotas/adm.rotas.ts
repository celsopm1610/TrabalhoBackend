import express from "express";
import AdmController from "../Controles/adm.controle.js"; 

const router = express.Router();

router.post("/adm/albuns", AdmController.criarAlbum);
router.get("/adm/albuns", AdmController.listarAlbuns);
router.put("/adm/albuns/:id", AdmController.atualizarAlbum);
router.delete("/adm/albuns/:id", AdmController.removerAlbum);

export default router;