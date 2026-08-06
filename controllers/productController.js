import Product from "../models/Product.js";

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getProducts(req, res, next) {
  try {
    const products = await Product.find().populate("supplierId");

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate("supplierId");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
   next(error);
  }
}

export async function deleteProduct(req, res,next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
   next(error);
}}
export async function getLowStockProducts(req, res, next) {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ["$stockQuantity", "$reorderThreshold"]
      }
    }).populate("supplierId");
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }}