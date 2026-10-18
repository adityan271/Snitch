import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  createAccessToken,
  createRefreshToken,
  readRefreshToken,
} from "../utils/auth.utils.js";

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
    userId: user._id,
    role: user.role,
  });

  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  await userModel.findByIdAndUpdate(user._id, {
    refreshToken,
  });

  res.status(201).json({
    message: "User Registered Successfully",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const accessToken = createAccessToken({
    userId: user._id,
    role: user.role,
  });
  const refreshToken = createRefreshToken({
    userId: user._id,
    role: user.role,
  });

  await userModel.findOneAndUpdate(
    { email },
    {
      refreshToken,
    },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });

  res.status(201).json({
    message: "User loggedIn Successfully",
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    },
  });
}

export async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token is required",
    });
  }

  let decoded;
  try {
    decoded = readRefreshToken(refreshToken);
  } catch {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const { userId, role } = decoded;
  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  if (refreshToken !== user.refreshToken) {
    await userModel.findByIdAndUpdate(user._id, {
      refreshToken: null,
    });

    return res.status(401).json({
      message: "Refresh token mismatch",
    });
  }

  const accessToken = createAccessToken({
    userId,
    role,
  });

  const newRefreshToken = createRefreshToken({
    userId,
    role,
  });

  await userModel.findByIdAndUpdate(user._id, {
    refreshToken: newRefreshToken,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
  });

  res.status(200).json({
    message: "Tokens rotated successfully",
    data: {
      user: {
        email: user.email,
        name: user.name,
        id: user._id,
      },
      accessToken,
    },
  });
}

export async function getMe(req, res) {
  const { userId, role } = req.user;

  const user = await userModel.findById(userId);

  res.status(200).json({
    message: "User data fetched successfully",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
}
