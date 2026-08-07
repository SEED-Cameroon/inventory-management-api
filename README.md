# Inventory Management API

A RESTful backend API for managing products, suppliers, orders, and stock restocking operations.
The system helps small businesses track inventory levels, manage suppliers, prevent out-of-stock orders, and monitor restocking activities.

---

# Features

## Supplier Management

* Create suppliers
* Validate supplier information
* Link products to suppliers

## Product Management

* Create products
* Retrieve all products
* Retrieve a product by ID
* Update products
* Delete products
* Track stock quantity
* Identify low-stock products

## Order Management

* Create customer orders
* Automatically reduce product stock after successful orders
* Prevent orders when stock is insufficient

## Restock Management

* Add stock to products
* Automatically increase product quantity
* Track restock history

## Validation and Error Handling

* Request validation using express-validator
* Centralized error handling middleware
* Proper HTTP status codes

---

# Tech Stack

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* Jest
* Supertest
* express-validator
* dotenv

---

# Project Structure

```
Inventory-Management
│
├── config
│   └── db.js
│
├── controllers
│   ├── productController.js
│   ├── supplierController.js
│   ├── orderController.js
│   └── restockController.js
│
├── models
│   ├── Product.js
│   ├── Supplier.js
│   ├── Order.js
│   └── RestockEvent.js
│
├── routes
│   ├── productRoutes.js
│   ├── supplierRoutes.js
│   ├── orderRoutes.js
│   └── restockRoutes.js
│
├── middleware
│   └──errorHanddler.js
|
| 
├── validators
│      ├── orderValidator.js
|      ├── productValidator.js
|      ├── restockValidator.js
|      └── supplierValidator.js
|
├── tests
│   ├── setup.js
│   └── product.test.js
│
└── server.js
```

---

# Installation

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project folder:

```bash
cd Inventory-Management
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file:

```
PORT=3000

MONGO_URI=your_mongodb_connection_string
```

---

# Running the Application

Start development server:

```bash
npm start
```

The API will run on:

```
http://localhost:3000
```

---

# Running Tests

Run Jest and Supertest:

```bash
npm test
```

The test suite covers:

* Supplier creation
* Supplier validation
* Product creation
* Product validation
* Product retrieval
* Low-stock filtering
* Product update
* Product deletion
* Order creation
* Insufficient stock handling
* Restocking
* Unknown routes

---

# API Endpoints

## Suppliers

### Create Supplier

```
POST /api/suppliers
```

Example body:

```json
{
  "name": "Tech World Suppliers",
  "contactEmail": "techworld@supplier.com"
}
```

---

## Products

### Create Product

```
POST /api/products
```

Example body:

```json
{
  "name": "Gaming Keyboard",
  "sku": "GK-001",
  "price": 120,
  "stockQuantity": 8,
  "reorderThreshold": 10,
  "supplierId": "supplier_id"
}
```

---

### Get All Products

```
GET /api/products
```

---

### Get Product By ID

```
GET /api/products/:id
```

---

### Get Low Stock Products

```
GET /api/products/low-stock
```

Returns products where:

```
stockQuantity <= reorderThreshold
```

---

### Update Product

```
PUT /api/products/:id
```

---

### Delete Product

```
DELETE /api/products/:id
```

---

## Orders

### Create Order

```
POST /api/orders
```

Example:

```json
{
  "productId": "product_id",
  "quantity": 4
}
```

Successful order:

```
201 Created
```

Insufficient stock:

```
409 Conflict
```

---

## Restock

### Create Restock

```
POST /api/restock
```

Example:

```json
{
  "productId": "product_id",
  "supplierId": "supplier_id",
  "quantity": 10
}
```

---

### Get Restocks

```
GET /api/restock
```

---

# Database Relationships

```
Supplier
   |
   |
 Products
   |
   |
 Orders
   |
   |
 Restock Events
```

Products reference suppliers using MongoDB ObjectId relationships.

---

# Status Codes Used

| Code | Meaning                       |
| ---- | ----------------------------- |
| 200  | Successful request            |
| 201  | Resource created              |
| 400  | Validation error              |
| 404  | Resource not found            |
| 409  | Conflict (insufficient stock) |
| 500  | Server error                  |

---

# Author

Inventory Management API Project

# Inventory-Management
Inventory management API for Stock management (A practice assignment on APIs -SharrelLaure- Project 2)
