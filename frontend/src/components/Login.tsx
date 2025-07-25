import { useState } from "react";

export default function Login({ onLoginSuccess }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
  const res = await fetch(`http://localhost:3000${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    const username = email.split("@")[0]; // 👈 EXTRAEMOS EL NOMBRE DEL EMAIL
    onLoginSuccess({ id: data.userId, username }); // 👈 PASAMOS UN OBJETO COMPLETO
  } else {
    alert(data.error || "Error en la autenticación");
  }
};


  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isRegistering ? "Registrarse" : "Iniciar sesión"}</h2>

        <p>
          {isRegistering
            ? "Crea tu cuenta para comenzar a jugar"
            : "Ingresa tus datos para continuar"}
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit">
          {isRegistering ? "Registrar" : "Ingresar"}
        </button>

        <p>
          {isRegistering ? "¿Ya tenés cuenta?" : "¿No tenés cuenta?"}{" "}
          <button type="button" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? "Iniciar sesión" : "Registrarme"}
          </button>
        </p>
      </form>
    </div>
  );
}
