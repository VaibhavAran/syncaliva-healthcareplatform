// server/controllers/userController.jsx
import db from "../db.js";

// Check if profile exists
export const checkUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const [rows] = await db.query("SELECT * FROM profiles WHERE uid = ?", [uid]);
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    res.status(500).json({ message: "Error checking profile" });
  }
};

// Save new profile
export const saveUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, state, age, disease } = req.body;
    await db.query(
  `INSERT INTO profiles (uid, name, state, age, disease) 
   VALUES (?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE name = VALUES(name), state = VALUES(state), age = VALUES(age), disease = VALUES(disease)`,
  [uid, name, state, age, disease || null]
);

    res.json({ message: "Profile saved" });
  } catch (err) {
    res.status(500).json({ message: "Error saving profile" });
  }
};

// Get profile details
export const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const [rows] = await db.query("SELECT * FROM profiles WHERE uid = ?", [uid]);
    if (rows.length === 0) return res.status(404).json({ message: "Profile not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};
