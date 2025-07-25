// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
const axios = require('axios');
import mongoose from "mongoose";
import sessionsRouter from "./routes/sessions"; // suponiendo que ya lo tenés creado
import authRoutes from "./routes/auth";
import freesoundRoutes from "./routes/freesound";



dotenv.config();
console.log("🔑 API KEY:", process.env.FREESOUND_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("🧠 Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.get("/", (req, res) => {
  res.send("🎶 Bienvenida a la Memoria Musical API 🎶");
});

app.use("/api/sessions", sessionsRouter);
app.use("/api/auth", authRoutes);
app.use("/api/freesound", freesoundRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
