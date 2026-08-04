import express from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});
async function start() {
    await connectDB();
    app.listen(PORT,() => {
        console.log(`server is running at http://localhost:${PORT}`);
    })
}

if (process.env.NODE_ENV !== "test") {
    start();
}