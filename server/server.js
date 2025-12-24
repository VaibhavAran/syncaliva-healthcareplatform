// server/server.js

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";
import preventionRoutes from "./routes/preventionRoutes.js";
import meditationRoutes from "./routes/meditationRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import chatRoutes from "./routes/chat.js";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/users", userRoutes);
app.use("/api/prevention", preventionRoutes);
app.use("/api/meditation", meditationRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/chat", chatRoutes);


app.listen(5000, () => console.log("Server running on port 5000"));
