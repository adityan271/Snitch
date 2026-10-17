import { Router } from "express";
import { registerValidator } from "../validators/auth.validators.js";

const router = Router();

router.post("/register",registerValidator,)

export default router;
