// server/routes/userRoutes.js
import express from "express";
import { checkUserProfile, saveUserProfile, getUserProfile } from "../controllers/userController.js";
import admin from "firebase-admin";

const router = express.Router();

// Middleware to verify Firebase token
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/profile/check", authenticate, checkUserProfile);
router.post("/profile", authenticate, saveUserProfile);
router.get("/profile", authenticate, getUserProfile);

export default router;
