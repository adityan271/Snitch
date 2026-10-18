import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validators.js";
import { register, login } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

export default router;
