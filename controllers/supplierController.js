import Supplier from "../models/Supplier.js";

export async function createSupplier(req, res, next) {
  try {
    const supplier = await Supplier.create(req.body);

    res.status(201).json(supplier);
  } catch (error) {
    next(error);    
  }
}

export async function getSuppliers(req, res, next) {
  try {
    const suppliers = await Supplier.find();

    res.status(200).json(suppliers);
  } catch (error) {
    next(error);    
   
  }
}

export async function getSupplierById(req, res, next ) {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json(supplier);
  } catch (error) {
   next(error);
  }
}

export async function updateSupplier(req, res, next) {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json(supplier);
  } catch (error) {
   next(error);
  }
}

export async function deleteSupplier(req, res, next ) {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      message: "Supplier deleted successfully",
    });
  } catch (error) {
   next(error);
  }
}