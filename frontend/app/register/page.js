"use client" 
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/authContext";
import { login as loginService } from "../../src/services/authService";
import Link from "next/link";


export default function RegisterPage(){
  const [name, setName] = useState ("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginService(name, email, password);
      login(data.user, data.token);
      router.push("/catalog");
    } catch (err) {
      setError("Error al registrarse, intenta de nuevo...");
    } finally {
      setLoading(false);
    }
  };

  return(
     <div style={{ maxWidth: "400px", margin: "100px auto", padding: "2rem" }}>
      <h1>Registro</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}



      <form onSubmit={handleSubmit}>
       <div style={{ marginBottom: "1rem" }}>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
            required
          />
        </div>


        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
            required
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", background: "#000", color: "#fff", border: "none", cursor: "pointer" }}
        >
          {loading ? "Cargando..." : "Registrarse"}
        </button>
      </form>

    </div>
  );


}