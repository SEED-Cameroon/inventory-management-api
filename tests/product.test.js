import "./setup.js";

import request from "supertest";
import app from "../server.js";

import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import RestockEvent from "../models/RestockEvent.js";

describe("Supplier API", () => {
  test("should create a supplier successfully", async () => {
    const supplierData = {
      name: "ABC Suppliers",
      contactEmail: "sales@abc.com",
    };

    const response = await request(app)
      .post("/api/suppliers")
      .send(supplierData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(supplierData.name);
    expect(response.body.contactEmail)
      .toBe(supplierData.contactEmail);
  });

  test("should reject an invalid supplier email", async () => {
    const response = await request(app)
      .post("/api/suppliers")
      .send({
        name: "ABC Suppliers",
        contactEmail: "not-an-email",
      });
    expect(response.status).toBe(400);
  });
});

describe("Product API", () => {
  test("should create a product successfully", async () => {

    const supplier = await Supplier.create({
      name: "ABC Suppliers",
      contactEmail: "sales@abc.com",
    });

    const productData = {
      name: "Wireless Mouse",
      sku: "WM-001",
      price: 25.99,
      stockQuantity: 50,
      reorderThreshold: 10,
      supplierId: supplier._id,
    };

    const response = await request(app)
      .post("/api/products")
      .send(productData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name).toBe(productData.name);
    expect(response.body.sku).toBe(productData.sku);
    expect(response.body.stockQuantity)
      .toBe(productData.stockQuantity);
    expect(response.body.supplierId)
      .toBe(supplier._id.toString());

  });

  test("should reject invalid product data", async () => {
    const supplier = await Supplier.create({
      name: "ABC Suppliers",
      contactEmail: "sales@abc.com",
    });

    const response = await request(app)
      .post("/api/products")
      .send({
        name: "",
        sku: "",
        price: -100,
        stockQuantity: -5,
        reorderThreshold: -1,
        supplierId: supplier._id,
      });
    expect(response.status).toBe(400);
  });

  test("should get all products successfully", async () => {

    const supplier = await Supplier.create({
      name: "Tech Supplier",
      contactEmail: "tech@supplier.com",
    });

    await Product.create({
      name: "Laptop",
      sku: "LP-001",
      price: 2000,
      stockQuantity: 20,
      reorderThreshold: 5,
      supplierId: supplier._id,
    });

    await Product.create({
      name: "Phone",
      sku: "PH-001",
      price: 800,
      stockQuantity: 50,
      reorderThreshold: 10,
      supplierId: supplier._id,
    });

    const response = await request(app)
      .get("/api/products");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("supplierId");
  });

  test("should get a product by ID successfully", async () => {
    const supplier = await Supplier.create({
      name: "Laptop Supplier",
      contactEmail: "laptop@supplier.com",
    });

    const product = await Product.create({
      name: "Gaming Laptop",
      sku: "GL-001",
      price: 2500,
      stockQuantity: 10,
      reorderThreshold: 3,
      supplierId: supplier._id,
    });

    const response = await request(app)
      .get(`/api/products/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.name)
      .toBe("Gaming Laptop");
    expect(response.body.supplierId)
      .toHaveProperty("name");
  });

  test("should return low stock products successfully", async () => {
  const supplier = await Supplier.create({
    name: "Low Stock Supplier",
    contactEmail: "lowstock@supplier.com",
  });
  await Product.create({
    name: "Gaming Keyboard",
    sku: "GK-001",
    price: 120,
    stockQuantity: 5,
    reorderThreshold: 10,
    supplierId: supplier._id,
  });
  await Product.create({
    name: "Laptop",
    sku: "LP-001",
    price: 2000,
    stockQuantity: 50,
    reorderThreshold: 10,
    supplierId: supplier._id,
  });
  const response = await request(app)
    .get("/api/products/low-stock");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(1);
  expect(response.body[0].name)
    .toBe("Gaming Keyboard");
  expect(response.body[0].stockQuantity)
    .toBe(5);
  expect(response.body[0].reorderThreshold)
    .toBe(10);
expect(response.body[0].supplierId)
    .toHaveProperty("name");
});
test("should delete a product successfully", async () => {
  const supplier = await Supplier.create({
    name: "Delete Supplier",
    contactEmail: "delete@supplier.com",
  });
  const product = await Product.create({
    name: "Delete Mouse",
    sku: "MS-001",
    price: 50,
    stockQuantity: 10,
    reorderThreshold: 2,
    supplierId: supplier._id,
  });
  const response = await request(app)
    .delete(`/api/products/${product._id}`);
  expect(response.status).toBe(200);
  expect(response.body.message)
    .toBe("Product deleted successfully");
  const deletedProduct =
    await Product.findById(product._id);
  expect(deletedProduct)
    .toBeNull();
});

test("should update a product successfully", async () => {
  const supplier = await Supplier.create({
    name: "Update Supplier",
    contactEmail: "update@supplier.com",
  });
  const product = await Product.create({
    name: "Old Keyboard",
    sku: "KB-001",
    price: 100,
    stockQuantity: 5,
    reorderThreshold: 2,
    supplierId: supplier._id,
  });
  const response = await request(app)
    .put(`/api/products/${product._id}`)
    .send({
      name: "New Keyboard",
      price: 150,
    });
  expect(response.status).toBe(200);
  expect(response.body.name)
    .toBe("New Keyboard");
  expect(response.body.price)
    .toBe(150);
});
});

describe("Order API", () => {
  test("should create an order successfully and reduce stock", async () => {
    const supplier = await Supplier.create({
      name: "Order Supplier",
      contactEmail: "orders@supplier.com",
    });
    const product = await Product.create({
      name: "Keyboard",
      sku: "KB-001",
      price: 100,
      stockQuantity: 20,
      reorderThreshold: 5,
      supplierId: supplier._id,
    });
    const response = await request(app)
      .post("/api/orders")
      .send({
        productId: product._id,
        quantity: 4,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.productId)
      .toBe(product._id.toString());
    expect(response.body.quantity)
      .toBe(4);
    expect(response.body.status)
      .toBe("completed");
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stockQuantity)
      .toBe(16);
  });

  test("should reject an order if stock is insufficient", async () => {

    const supplier = await Supplier.create({
      name: "Order Supplier",
      contactEmail: "orders@supplier.com",
    });
    const product = await Product.create({
      name: "Keyboard",
      sku: "KB-001",
      price: 100,
      stockQuantity: 2,
      reorderThreshold: 5,
      supplierId: supplier._id,
    });
    const response = await request(app)
      .post("/api/orders")
      .send({
        productId: product._id,
        quantity: 5,
      });
    expect(response.status).toBe(409);
    expect(response.body.message)
      .toBe("Insufficient stock");
    const unchangedProduct = await Product.findById(product._id);
    expect(unchangedProduct.stockQuantity)
      .toBe(2);
  });
});

describe("Restock API", () => {

  test("should create a restock successfully and increase stock", async () => {
    const supplier = await Supplier.create({
      name: "Restock Supplier",
      contactEmail: "restock@supplier.com",
    });
    const product = await Product.create({
      name: "Monitor",
      sku: "MN-001",
      price: 300,
      stockQuantity: 5,
      reorderThreshold: 2,
      supplierId: supplier._id,
    });
    const response = await request(app)
      .post("/api/restock")
      .send({
        productId: product._id,
        supplierId: supplier._id,
        quantity: 10,
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.productId)
      .toBe(product._id.toString());
    expect(response.body.supplierId)
      .toBe(supplier._id.toString());
    expect(response.body.quantity)
      .toBe(10);
    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.stockQuantity)
      .toBe(15);
  });

  test("should get all restocks successfully", async () => {
    const supplier = await Supplier.create({
      name: "Warehouse Supplier",
      contactEmail: "warehouse@supplier.com",
    });
    const product = await Product.create({
      name: "Printer",
      sku: "PR-001",
      price: 500,
      stockQuantity: 10,
      reorderThreshold: 3,
      supplierId: supplier._id,
    });
    await RestockEvent.create({
      productId: product._id,
      supplierId: supplier._id,
      quantity: 20,
    });
    const response = await request(app)
      .get("/api/restock");
    expect(response.status).toBe(200);
    expect(response.body.length)
      .toBe(1);
    expect(response.body[0])
      .toHaveProperty("quantity");
    expect(response.body[0].productId)
      .toHaveProperty("name");
    expect(response.body[0].supplierId)
      .toHaveProperty("name");
  });
});

describe("General API", () => {
  test("should return 404 for an unknown route", async () => {
    const response = await request(app)
      .get("/api/not-a-real-route");
    expect(response.status)
      .toBe(404);
    expect(response.body.error)
      .toBe("Route GET /api/not-a-real-route not found");
  });
});