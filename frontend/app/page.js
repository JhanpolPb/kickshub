import Link from "next/link";
import HomeProductsSection from "../src/components/HomeProductsSection";

export const metadata = {
  title: "KicksHub — Sneakers Auténticos",
};

const brands = ["Nike", "Adidas", "Jordan", "New Balance", "Louis Vuitton"];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    title: "100% Auténticos",
    desc: "Todos nuestros productos son originales y verificados. Cero replicas, cero dudas.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Envío rápido",
    desc: "Recibe tus sneakers en la puerta de tu casa. Tracking en tiempo real.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <polyline points="1 4 1 10 7 10"/>
        <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
      </svg>
    ),
    title: "Devoluciones",
    desc: "30 días para cambios y devoluciones sin preguntas. Sin letra pequeña.",
  },
];

// Fetch en el servidor — sin CORS, sin parpadeos
async function getProducts() {
  try {
    const res = await fetch("https://kickshub.onrender.com/api/products", {
      next: { revalidate: 60 }, // refresca cada 60s en producción
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const allProducts = await getProducts();
  // Mostrar los primeros 8 en la landing, el resto lo ve en catálogo
  const featuredProducts = allProducts.slice(0, 8);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">

      {/* ── HERO (compacto, deja espacio para los productos) ── */}
      <section className="relative bg-black text-white min-h-[70vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "38px 38px",
            }}
          />
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/[0.025] blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-white/[0.025] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/70 text-xs tracking-[0.2em] uppercase font-medium">
              Nueva colección 2026
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] mb-6 select-none">
            KICKS
            <br />
            <span className="text-white/15">HUB</span>
          </h1>

          <p className="text-white/50 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed font-light">
            Los mejores sneakers en un solo lugar.
            Autenticidad garantizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#products"
              className="group inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 font-bold text-sm tracking-widest uppercase rounded transition-all duration-300 hover:bg-white/90"
            >
              Ver colección
              <span className="group-hover:translate-y-0.5 transition-transform duration-300">↓</span>
            </a>
            <Link
              href="/register"
              className="inline-flex items-center justify-center border border-white/25 text-white/80 px-8 py-3.5 font-medium text-sm tracking-widest uppercase rounded hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <div className="relative w-px h-10 bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-white/40 animate-scroll-down" style={{ height: "40%" }} />
          </div>
        </div>
      </section>

      {/* ── BRANDS TICKER ── */}
      <section className="bg-black border-t border-white/5 py-5 overflow-hidden">
        <div className="relative flex overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...brands, ...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-xl font-black text-white/20 hover:text-white/50 transition-colors duration-300 cursor-default flex-shrink-0"
              >
                {brand}
              </span>
            ))}
          </div>
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
        </div>
      </section>

      {/* ── PRODUCTOS DESTACADOS ── */}
      <section id="products" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Header sección */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-black/30 text-[10px] tracking-[0.4em] uppercase mb-2">
                Lo más nuevo
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Colección destacada
              </h2>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-black/50 hover:text-black transition-colors group"
            >
              Ver todos
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>

          {/* Grid de productos — Client Component para interactividad */}
          <HomeProductsSection products={featuredProducts} />

          {/* Ver más — mobile */}
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3.5 font-bold text-sm tracking-widest uppercase rounded hover:bg-black/80 transition-colors"
            >
              Ver todos los sneakers →
            </Link>
          </div>

          {/* Ver más — desktop */}
          <div className="hidden sm:flex justify-center mt-10">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 border border-black/20 text-black px-10 py-3.5 font-bold text-sm tracking-widest uppercase rounded hover:bg-black hover:text-white transition-all duration-300 group"
            >
              Ver catálogo completo
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-black/[0.02] border-y border-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-black/30 text-[10px] tracking-[0.4em] uppercase mb-3">Por qué elegirnos</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              La diferencia KicksHub
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <div
                key={item.title}
                className="group relative bg-white border border-black/8 rounded-2xl p-8 hover:border-black/20 hover:shadow-xl hover:shadow-black/6 hover:-translate-y-1 transition-all duration-400 cursor-default"
              >
                <span className="absolute top-5 right-7 text-7xl font-black text-black/[0.04] select-none group-hover:text-black/[0.07] transition-colors duration-400">
                  0{i + 1}
                </span>
                <div className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-black text-base mb-2">{item.title}</h3>
                <p className="text-black/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative bg-black text-white py-24 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            ¿No encontraste
            <br />
            lo que buscas?
          </h2>
          <p className="text-white/40 mb-10 font-light">
            Tenemos más de 500 modelos esperándote en el catálogo.
          </p>
          <Link
            href="/catalog"
            className="group inline-flex items-center gap-3 bg-white text-black px-12 py-4 font-black text-sm tracking-widest uppercase rounded hover:bg-white/90 transition-all duration-300"
          >
            Ver catálogo completo
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-white font-black text-lg tracking-widest">
            KICKS<span className="text-white/20">HUB</span>
          </span>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            © 2026 KicksHub — Sneakers auténticos
          </p>
          <div className="flex gap-6">
            <Link href="/catalog" className="text-white/30 text-xs hover:text-white/70 transition-colors tracking-widest uppercase">
              Catálogo
            </Link>
            <Link href="/login" className="text-white/30 text-xs hover:text-white/70 transition-colors tracking-widest uppercase">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
