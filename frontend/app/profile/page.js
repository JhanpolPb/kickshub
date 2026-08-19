"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getProfile, updateProfile, changePassword } from "../../src/services/userService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    getProfile()
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
      })
      .catch(() => toast.error("Error cargando perfil"))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(name, email);
      toast.success("Perfil actualizado correctamente");
    } catch {
      toast.error("Error al actualizar el perfil");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Contraseña actualizada correctamente");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Contraseña actual incorrecta");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Cuenta
        </p>
        <h1 className="text-4xl font-black tracking-tight">Mi Perfil</h1>
        <p className="text-white/40 text-sm mt-2">{user?.email}</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Info personal */}
        <div className="border border-black/8 rounded-xl overflow-hidden">
          <div className="bg-black/[0.02] px-6 py-4 border-b border-black/8">
            <h2 className="font-bold text-sm tracking-wide">Información personal</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-black/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-black/20 rounded px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-black text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-black/80 transition-colors disabled:opacity-60 active:scale-[0.98]"
              >
                {savingProfile ? "Guardando..." : "Guardar cambios"}
              </button>
            </form>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="border border-black/8 rounded-xl overflow-hidden">
          <div className="bg-black/[0.02] px-6 py-4 border-b border-black/8">
            <h2 className="font-bold text-sm tracking-wide">Cambiar contraseña</h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-black/20 rounded px-4 py-3 text-sm placeholder:text-black/25 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-black/20 rounded px-4 py-3 text-sm placeholder:text-black/25 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="bg-black text-white px-6 py-2.5 rounded font-bold text-sm hover:bg-black/80 transition-colors disabled:opacity-60 active:scale-[0.98]"
              >
                {savingPassword ? "Actualizando..." : "Cambiar contraseña"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
