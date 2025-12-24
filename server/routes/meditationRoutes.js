import express from "express";
import admin from "firebase-admin";

const router = express.Router();

// Firebase auth middleware (still here if you want to protect future endpoints)
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

// No meditation progress/save routes anymore.
// You can add future meditation-related endpoints here if needed.

export default router;
