import RestockEvent from "../models/RestockEvent.js";
import Product from "../models/Product.js";

export async function createRestock(req, res, next) {
  try {
    const { productId, supplierId, quantity } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $inc: {
          stockQuantity: quantity,
        },
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const restock = await RestockEvent.create({
      productId,
      supplierId,
      quantity,
    });

    res.status(201).json(restock);
  } catch (error) {
   next(error);
  }
}

export async function getRestocks(req, res, next) {
  try {
    const restocks = await RestockEvent.find()
      .populate("productId")
      .populate("supplierId");

    res.status(200).json(restocks);
  } catch (error) {
    next(error);
  }
}