import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Bienvenido a KicksHub </h1>
      <p>Tu tienda de sneakers de confianza</p>
      <Link href="/catalog">Ver catálogo</Link>
      <p>Compra ahora tus sneakers favoritos y disfruta de la mejor experiencia de compra en línea.</p>
      <Link href="/login">Iniciar sesión</Link>    
      </div>
  );
}