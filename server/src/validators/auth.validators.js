import { body, validationResult } from "express-validator";

export const registerValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid Email address"),

  body("name")
    .exists()
    .withMessage("Name is required")
    .bail()
    .isString()
    .withMessage("Name must be a String")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name length must be between 2 to 50 characters"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a String")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters long"),

  (req, res, next) => {
    const errros = validationResult(req);

    if (!errros.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errros: errros.array(),
      });
    }
    next();
  },
];

export const loginValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .bail()
    .isString()
    .withMessage("Email must be a String")
    .bail()
    .trim()
    .isEmail()
    .withMessage("Enter a valid Email address"),

  body("password")
    .exists()
    .withMessage("Password is required")
    .bail()
    .isString()
    .withMessage("Password must be a String")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be minimum 6 characters long"),

  (req, res, next) => {
    const errros = validationResult(req);

    if (!errros.isEmpty()) {
      return res.status(400).json({
        message: "Invalid Request",
        errros: errros.array(),
      });
    }
    next();
  },
];
