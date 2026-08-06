import mongoose from "mongoose";
import { connectDB } from "../config/db.js";

import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Restock from "../models/RestockEvent.js";

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await connectDB();
});

beforeEach(async () => {
  await Supplier.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Restock.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});