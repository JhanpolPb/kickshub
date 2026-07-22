"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

export default function Navbar(){
    const  {user, logout} = useAuth();
    const {router} = useRouter();

    const handleLogout = async () => {
        logout (),
        router.push("/login")
    };

    return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      background: "#000",
      color: "#fff",
      position: "sticky",
      top: 0,
      zIndex: 100
    }}>
      {/* Logo */}
      <Link href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "1.5rem", fontWeight: "bold" }}>
        KicksHub 
      </Link>

      {/* Links */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link href="/catalog" style={{ color: "#fff", textDecoration: "none" }}>
          Catálogo
        </Link>

        {user ? (
          <>
            <Link href="/cart" style={{ color: "#fff", textDecoration: "none" }}>
              Carrito 
            </Link>
            <Link href="/orders" style={{ color: "#fff", textDecoration: "none" }}>
              Mis órdenes
            </Link>
            <Link href="/profile" style={{ color: "#fff", textDecoration: "none" }}>
              {user.name}
            </Link>
            <button
              onClick={handleLogout}
              style={{ background: "transparent", color: "#fff", border: "1px solid #fff", padding: "6px 16px", borderRadius: "4px", cursor: "pointer" }}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#fff", textDecoration: "none" }}>
              Iniciar sesión
            </Link>
            <Link href="/register" style={{
              background: "#fff", color: "#000", padding: "6px 16px", borderRadius: "4px", textDecoration: "none", fontWeight: "500"
            }}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

