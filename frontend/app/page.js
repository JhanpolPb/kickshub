import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenido a KicksHub </h1>
      <p>Tu tienda de sneakers de confianza</p>
      <Link href="/catalog">Ver catálogo</Link>
      <Link href="/login">Iniciar sesión</Link>    </div>
  );
}