import Order from "../models/Order.js";
import Product from "../models/Product.js";

export async function createOrder(req, res, next) {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        stockQuantity: { $gte: quantity },
      },
      {
        $inc: {
          stockQuantity: -quantity,
        },
      },
      {
        new: true,
      }
    );

    if (!product) {
      return res.status(409).json({
        message: "Insufficient stock",
      });
    }

    const order = await Order.create({
      productId,
      quantity,
      status: "completed",
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const orders = await Order.find().populate("productId");

    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
}