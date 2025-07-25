import { Router } from "express";
import axios from "axios";

const router = Router();


router.get("/search", async (req, res) => {
  const query = req.query.q || "piano";
  const FREESOUND_API_KEY = process.env.FREESOUND_API_KEY;
  if (!FREESOUND_API_KEY) {
    return res.status(500).json({ error: "API Key no configurada" });
  }

  try {
    const response = await axios.get("https://freesound.org/apiv2/search/text/", {
      params: {
        query,
        token: FREESOUND_API_KEY,
        fields: "id,name,previews,duration",
      },
    });

    res.json(response.data); // Devuelve el array con los resultados
  } catch (err: any) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: "Error al buscar sonidos" });
  }
});

export default router;