import express from "express";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Example protected admin route
router.get("/dashboard", authenticateUser, isAdmin, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard" });
});

export default router;
