import express from "express";
import AuthController from "../controles/auto.controle.ts";

const router = express.Router();

router.post("/auth/registro", AuthController.registrar);
router.post("/auth/login", AuthController.login);
router.post("/auth/validar", AuthController.validarToken);

export default router;
