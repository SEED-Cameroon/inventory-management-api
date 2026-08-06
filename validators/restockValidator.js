import { body } from "express-validator";

export const createRestockValidator = [
  body("productId")
    .isMongoId()
    .withMessage("A valid product ID is required"),

  body("supplierId")
    .isMongoId()
    .withMessage("A valid supplier ID is required"),

  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];