import { body, validationResult } from "express-validator";

export const createSupplierValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Supplier name is required"),

  body("contactEmail")
    .trim()
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
];

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  next();
}