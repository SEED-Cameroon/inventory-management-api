import { body } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stockQuantity")
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be 0 or greater"),

  body("reorderThreshold")
    .isInt({ min: 0 })
    .withMessage("Reorder threshold must be 0 or greater"),

  body("supplierId")
    .isMongoId()
    .withMessage("Supplier ID must be a valid MongoDB ObjectId"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),

  body("sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("SKU cannot be empty"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("stockQuantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock quantity must be 0 or greater"),

  body("reorderThreshold")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reorder threshold must be 0 or greater"),

  body("supplierId")
    .optional()
    .isMongoId()
    .withMessage("Supplier ID must be a valid MongoDB ObjectId"),
];`12   `