import { Router } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";

const router = Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log("Datos recibidos:", { email, password });

  try {
    const existing = await User.findOne({ email });
    console.log("Usuario existente:", existing);

    if (existing) return res.status(400).json({ error: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hasheado:", hashedPassword);

    const user = new User({ email, password: hashedPassword });
    await user.save();

   res.json({ 
  userId: user._id, 
  email: user.email 
});
// Solo el ID real que Mongo necesita

  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});

// 📌 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    // Comparar la contraseña con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Credenciales inválidas" });

  res.json({ 
  userId: user._id, 
  email: user.email 
});
// Solo el ID real que Mongo necesita

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

export default router;
