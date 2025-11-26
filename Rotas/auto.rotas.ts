import express from "express";
import AuthController from "../controles/auto.controle.ts";

const router = express.Router();

router.post("/registro", AuthController.registrar); //
router.post("/login", AuthController.login);        //
router.post("/validar", AuthController.validarToken); //

export default router;