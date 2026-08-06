import express from "express";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

import {
  createSupplierValidator,
  handleValidationErrors,
} from "../validators/supplierValidator.js";

const router = express.Router();

router.post(
  "/",
  createSupplierValidator,
  handleValidationErrors,
  createSupplier
);
router.get("/", getSuppliers);

router.get("/:id", getSupplierById);

router.put("/:id", updateSupplier);

router.delete("/:id", deleteSupplier);

export default router;