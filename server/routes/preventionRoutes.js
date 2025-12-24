import express from "express";
import admin from "firebase-admin";
import { getPreventionContent } from "../controllers/preventionController.js";

const router = express.Router();

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

router.get("/content", authenticate, getPreventionContent);

export default router;
