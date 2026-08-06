import express from "express";

import {
  createRestock,
  getRestocks,
} from "../controllers/restockController.js";

const router = express.Router();

router.post("/", createRestock);

router.get("/", getRestocks);

export default router;