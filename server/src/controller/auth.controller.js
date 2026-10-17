import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken, createRefreshToken } from "../utils/auth.utils.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    email,
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User already exists with this email",
      errors: [
        {
          feild: "email",
          message: "User already exists with this email",
        },
      ],
    });
  }

  const user = await userModel.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 12),
  });

  const accessToken = createAccessToken({
    userId: _id,
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    userId: _id,
    role: user.role,
  });
}
