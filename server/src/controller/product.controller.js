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

    filesUrls.push(responce.url);
  }

  const product = await productModel.create({
    title: req.body.title,
    description: req.body.description,
    price: {
      amount: req.body.price.amount,
      currency: req.body.price.currency,
    },
    sizes: req.body.sizes,
    images: filesUrls,
    seller: req.user.userId,
  });

  res.status(201).json({
    message: "Product created successfully",
    data: {
      product,
    },
  });
}
