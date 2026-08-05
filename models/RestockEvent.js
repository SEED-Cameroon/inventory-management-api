import mongoose from "mongoose";

const restockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },

  receivedAt: {
    type: Date,
    default: Date.now,
  },
});

const Restock = mongoose.model("Restock", restockSchema);

export default Restock;