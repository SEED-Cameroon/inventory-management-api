import { body } from "express-validator";

export const createOrderValidator = [
  body("productId")
    .isMongoId()
    .withMessage("A valid product ID is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];