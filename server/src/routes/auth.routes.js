import { Router } from "express";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validators.js";
import {
  register,
  login,
  refresh,
  getMe,
} from "../controller/auth.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

router.post("/refresh", refresh);

router.get("/me", authenticate, getMe);

export default router;
