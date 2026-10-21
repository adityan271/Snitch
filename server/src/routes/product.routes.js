import { Router } from "express";
import { createProductValidator } from "../validators/product.validator.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createProduct } from "../controller/product.controller.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @method POST
 * @route /api/products/
 * @description creates the product and save its data into the DB,
 *  images will be store on imagekit.
 * @access seller
 * req.body=>{title,description:price:{amount,currency},sizes:[{size,stock},{si–ze,stock}]}
 */

router.post(
  "/",
  authenticate,
  (req, res, next) => {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "User is not authorized to create products",
      });
    }
    next();
  },
  upload.array("images"),
  (req, res, next) => {
    req.body.price = JSON.parse(req.body.price);
    req.body.sizes = JSON.parse(req.body.sizes);

    next();
  },
  createProduct,
);

export default router;
