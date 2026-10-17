import userModel from "../models/user.model.js";

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
}
