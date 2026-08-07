import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";

import supplierRoutes from "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import restockRoutes from "./routes/restockRoutes.js";

import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "Inventory Management API",
    status: "Running",
    version: "1.0.0",
    endpoints: [
      "/api/products",
      "/api/suppliers",
      "/api/orders",
      "/api/restock"
    ]
  });
});

app.use(express.json());

app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restock", restockRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use(errorHandler);

async function start() {
    await connectDB();
    app.listen(PORT,() => {
        console.log(`server is running at http://localhost:${PORT}`);
    })
}

if (process.env.NODE_ENV !== "test") {
    start();
}

export default app;