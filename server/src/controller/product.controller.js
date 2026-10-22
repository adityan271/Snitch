import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  console.log(req.body);
  console.log(req.files);

  const filesUrls = [];

  for (let i = 0; i < req.files.length; i++) {
    const responce = await uploadFile({
      buffer: req.files[i].buffer,
      fileName: req.files[i].originalname,
    });
  }

  res.status(200).json({
    message: "Dummy responce",
  });
}
