import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
  console.log(req.body);
  console.log(req.files);

  const responses = await Promise.all(
    req.files.map((file) =>
      uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      }),
    ),
  );

  const filesUrls = responses.map((response) => response.url);

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

export async function listAllProducts(req, res) {
  const products = await productModel.find({ published: true });

  res.status(200).json({
    message: "Products data fetched successfully",
    data: {
      products,
    },
  });
}

export async function unlistProducts(req, res) {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "product not found by id",
    });
  }

  // –––––––––––––––––– make product unPublished –––––––––––––––––––––
  await productModel.findByIdAndUpdate(id, {
    published: false,
  });

  return res.status(200).json({
    message: "Product unpublished successfully",
  });
}
