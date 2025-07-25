import { Router } from "express";
import { Session } from "../models/Session";

const router = Router();

// Crear nueva sesión de juego
router.post("/", async (req, res) => {
  try {
    const { userId, attempts, matchedPairs, duration } = req.body;

    console.log("Recibido en backend:", { userId, attempts, matchedPairs, duration });

    const session = new Session({ userId, attempts, matchedPairs, duration });
    await session.save();

    res.status(201).json({ message: "Sesión guardada correctamente" });
  } catch (err: any) {
    console.error("❌ Error guardando sesión en backend:", err.message);
    res.status(500).json({ error: "Error guardando sesión", details: err.message });
  }
});


// Obtener sesiones del usuario
router.get("/:userId", async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo sesiones" });
  }
});
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deleted = await Session.findOneAndDelete({ userId });

    if (!deleted) {
      return res.status(404).json({ message: "Sesión no encontrada para este usuario" });
    }

    res.status(200).json({ message: "Progreso eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando progreso:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


export default router;
