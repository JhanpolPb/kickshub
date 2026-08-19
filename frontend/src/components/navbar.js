"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/authContext";
import { getCart } from "../services/cartService";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

 
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    getCart()
      .then((items) => setCartCount(items.reduce((sum, i) => sum + i.quantity, 0)))
      .catch(() => {});
  }, [user, pathname]);

 
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navLink =
    "text-sm font-medium text-white/80 hover:text-white transition-colors duration-200";
  const isActive = (href) => pathname === href;

  return (
    <nav
      className={`sticky top-0 z-50 bg-black transition-shadow duration-300 ${
        scrolled ? "shadow-lg shadow-black/30" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-white font-black text-xl tracking-widest hover:text-white/80 transition-colors"
          >
            KICKS<span className="text-white/40">HUB</span>
          </Link>

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/catalog"
              className={`${navLink} ${isActive("/catalog") ? "text-white border-b border-white pb-0.5" : ""}`}
            >
              Catálogo
            </Link>

            {user ? (
              <>
                <Link
                  href="/orders"
                  className={`${navLink} ${isActive("/orders") ? "text-white border-b border-white pb-0.5" : ""}`}
                >
                  Mis órdenes
                </Link>
                <Link
                  href="/profile"
                  className={`${navLink} ${isActive("/profile") ? "text-white border-b border-white pb-0.5" : ""}`}
                >
                  {user.name}
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className={`${navLink} text-yellow-400 hover:text-yellow-300`}>
                    Admin
                  </Link>
                )}
              </>
            ) : null}
          </div>

          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Carrito con contador */}
                <Link href="/cart" className="relative text-white hover:text-white/70 transition-colors">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/70 border border-white/30 px-4 py-1.5 rounded hover:bg-white hover:text-black transition-all duration-200"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={navLink}>
                  Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold bg-white text-black px-4 py-1.5 rounded hover:bg-white/90 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Botones móvil */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <Link href="/cart" className="relative text-white">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

   
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-white/10 px-4 py-4 flex flex-col gap-4 bg-black">
          <Link href="/catalog" className="text-white/80 hover:text-white text-sm font-medium py-1">
            Catálogo
          </Link>

          {user ? (
            <>
              <Link href="/orders" className="text-white/80 hover:text-white text-sm font-medium py-1">
                Mis órdenes
              </Link>
              <Link href="/profile" className="text-white/80 hover:text-white text-sm font-medium py-1">
                Mi perfil — {user.name}
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="text-yellow-400 text-sm font-medium py-1">
                  Panel Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-white border border-white/30 px-4 py-2 rounded hover:bg-white hover:text-black transition-all w-fit"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/80 hover:text-white text-sm font-medium py-1">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-white text-black px-4 py-2 rounded hover:bg-white/90 transition-colors w-fit"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function CartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
