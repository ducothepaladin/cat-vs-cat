import express from "express";
import { login, register } from "../../infrastructure/controllers/AuthController";
import { refresh } from "../../infrastructure/controllers/AuthController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);

export default router;