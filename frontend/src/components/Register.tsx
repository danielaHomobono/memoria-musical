// src/components/Register.tsx
import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
      });

      alert("Usuario registrado correctamente.");
    } catch (err: any) {
      console.error("Error en registro:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Error al registrarse");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrarme</button>
    </form>
  );
}

export default Register;
