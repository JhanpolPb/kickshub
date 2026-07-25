"use client";

import { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../../src/services/userService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    getProfile()
      .then((data) => {
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(name, email);
      setMessage({ type: "success", text: "Perfil actualizado correctamente" });
    } catch (err) {
      setMessage({ type: "error", text: "Error actualizando perfil" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changePassword(currentPassword, newPassword);
      setMessage({ type: "success", text: "Contraseña actualizada correctamente" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setMessage({ type: "error", text: "Error cambiando contraseña" });
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando perfil...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
      <h1>Mi Perfil</h1>

      {message && (
        <p style={{ color: message.type === "success" ? "green" : "red", padding: "10px", border: "1px solid", borderRadius: "4px" }}>
          {message.text}
        </p>
      )}

      {/* Editar perfil */}
      <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2>Información personal</h2>
        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Guardar cambios
          </button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1.5rem" }}>
        <h2>Cambiar contraseña</h2>
        <form onSubmit={handleChangePassword}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Contraseña actual</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px", border: "1px solid #ddd", borderRadius: "4px" }}
            />
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}