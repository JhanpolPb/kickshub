"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav style={{
      background: "#000",
      color: "#fff",
      padding: "1rem 2rem",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "1.3rem", fontWeight: "bold" }}>
          KicksHub 
        </Link>

        {/* Hamburger móvil */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: "transparent", border: "none", color: "#fff", fontSize: "1.5rem", cursor: "pointer", display: "block" }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Links */}
      {menuOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #333" }}>
          <Link href="/catalog" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>Catálogo</Link>

          {user ? (
            <>
              <Link href="/cart" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>Carrito </Link>
              <Link href="/orders" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>Mis órdenes</Link>
              <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>{user.name}</Link>
              <button onClick={handleLogout} style={{ background: "transparent", color: "#fff", border: "1px solid #fff", padding: "6px 16px", borderRadius: "4px", cursor: "pointer", width: "fit-content" }}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: "#fff", textDecoration: "none" }}>Iniciar sesión</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} style={{ background: "#fff", color: "#000", padding: "6px 16px", borderRadius: "4px", textDecoration: "none", fontWeight: "500", width: "fit-content" }}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

