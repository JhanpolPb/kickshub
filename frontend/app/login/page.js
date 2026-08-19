"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../../src/context/authContext";
import { login as loginService } from "../../src/services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginService(email, password);
      login(data.user, data.token);
      toast.success(`Bienvenido, ${data.user.name} 👋`);
      router.push("/catalog");
    } catch (err) {
      toast.error("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Panel izquierdo decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white flex-col items-center justify-center px-12">
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-4">
          Bienvenido de vuelta
        </p>
        <h1 className="text-6xl font-black tracking-tighter leading-none mb-3">
          KICKS
          <span className="block text-white/20">HUB</span>
        </h1>
        <p className="text-white/40 text-sm text-center max-w-xs mt-4">
          Tu tienda de sneakers auténticos. Inicia sesión para continuar.
        </p>
      </div>

      {/* Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="text-2xl font-black tracking-widest">
              KICKSHUB
            </Link>
          </div>

          <h2 className="text-2xl font-black mb-1">Iniciar sesión</h2>
          <p className="text-black/40 text-sm mb-8">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-black font-medium underline underline-offset-4">
              Regístrate
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full border border-black/20 rounded px-4 py-3 text-sm placeholder:text-black/25 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full border border-black/20 rounded px-4 py-3 text-sm placeholder:text-black/25 focus:outline-none focus:border-black transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors text-xs"
                >
                  {showPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3.5 font-bold text-sm tracking-widest uppercase rounded hover:bg-black/80 transition-colors disabled:opacity-60 disabled:cursor-wait active:scale-[0.98] mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
