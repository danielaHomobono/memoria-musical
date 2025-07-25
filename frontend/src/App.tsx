import { useState } from "react";
import Login from "./components/Login";
import Game from "./components/Game";
import SoundSearch from "./components/SoundSearch";

export interface User {
  id: string;
  username: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sessionData, setSessionData] = useState(null);

  const handleLoginSuccess = async (userData: User) => {
  setUser(userData);
  localStorage.setItem("userId", userData.id);

  try {
    const res = await fetch(`http://localhost:3000/api/sessions/${userData.id}`);
    const sessions = await res.json();

    if (res.ok && sessions.length > 0) {
      const lastSession = sessions[0]; // 👈 la más reciente por sort({ createdAt: -1 })
      console.log("🎯 Sesión previa encontrada:", lastSession);
      setSessionData(lastSession);
    } else {
      console.log("🆕 No hay sesiones previas, se empieza desde cero.");
    }
  } catch (err) {
    console.error("Error al recuperar sesión previa:", err);
  }
};

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("userId"); // 🔴 Limpieza
  };

  return (
    <div>
      {user ? (
        <div>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "10px",
            borderBottom: "1px solid #ccc"
          }}>
            <h2>Bienvenido, {user.username}!</h2>
            <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
              Cerrar Sesión
            </button>
          </div>
          <Game />
        </div>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
