import { Router } from "express";
import {
  createProductValidator,
  unlistProductValidator,
} from "../validators/product.validator.js";
import {
  authenticate,
  authenticateSeller,
} from "../middlewares/auth.middleware.js";
import {
  createProduct,
  listAllProducts,
  unlistProducts,
} from "../controller/product.controller.js";

import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 5,
    fileSize: 1 * 1024 * 1024, // 1MB
  },
});

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
  //------------ check, is user authenticate-------------
  authenticate,
  //------------ check the role is seller or not --------
  authenticateSeller,
  //------------ required for reading the data from req.body
  //  if the formate is form-data(multipart-form-----------
  upload.array("images"),
  //------------ parse the complex data like objects and arrays into json --------
  (req, res, next) => {
    req.body?.price && (req.body.price = JSON.parse(req.body.price));
    req.body?.sizes && (req.body.sizes = JSON.parse(req.body.sizes));

    next();
  },
  createProductValidator,
  createProduct,
);

/**
 * @method GET
 * @route /api/product
 * @description Read all the published products from the DB
 * @access user
 */
router.get("/", authenticate, listAllProducts);

/**
 * @method PATCH
 * @route /api/product/unlist/:id
 * @description Unlist products from the DB by its IDs
 * @access seller
 */
router.patch(
  "/unlist/:id",
  authenticate,
  authenticateSeller,
  unlistProductValidator,
  unlistProducts,
);

export default router;
