import Link from "next/link";

export const metadata = {
  title: "KicksHub — Sneakers Auténticos",
};

const brands = ["Nike", "Adidas", "Jordan", "New Balance", "Louis Vuitton"];

const features = [
  {
    icon: "✓",
    title: "100% Auténticos",
    desc: "Todos nuestros productos son originales y verificados. Cero replicas, cero dudas.",
  },
  {
    icon: "⚡",
    title: "Envío rápido",
    desc: "Recibe tus sneakers en la puerta de tu casa. Tracking en tiempo real.",
  },
  {
    icon: "↩",
    title: "Devoluciones",
    desc: "30 días para cambios y devoluciones sin preguntas. Sin letra pequeña.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* Hero */}
      <section className="relative bg-black text-white min-h-[92vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-white/50 tracking-[0.4em] text-xs uppercase mb-6 font-medium">
            Nueva colección 2026
          </p>

          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter leading-none mb-6">
            KICKS
            <span className="block text-white/20">HUB</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-md mx-auto mb-10 leading-relaxed">
            Los mejores sneakers en un solo lugar.
            <br />
            Autenticidad garantizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="bg-white text-black px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white/90 transition-colors rounded"
            >
              Shop Now
            </Link>
            <Link
              href="/register"
              className="border border-white/30 text-white px-10 py-4 font-medium text-sm tracking-widest uppercase hover:bg-white/10 transition-colors rounded"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-10 bg-white/20" />
        </div>
      </section>

      {/* Brands ticker */}
      <section className="border-y border-black/10 py-5 overflow-hidden bg-white">
        <p className="text-center text-black/30 text-xs tracking-[0.3em] uppercase mb-4">
          Marcas disponibles
        </p>
        <div className="flex justify-center gap-12 flex-wrap px-4">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-2xl font-black text-black/20 tracking-tight hover:text-black/60 transition-colors cursor-default"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 border-b border-black/10">
        {features.map((item) => (
          <div
            key={item.title}
            className="px-8 py-12 text-center hover:bg-black/[0.02] transition-colors"
          >
            <div className="w-12 h-12 bg-black text-white text-lg font-bold rounded-full flex items-center justify-center mx-auto mb-5">
              {item.icon}
            </div>
            <h3 className="font-bold text-base mb-2">{item.title}</h3>
            <p className="text-black/50 text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-24 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-4">
          Ready to drop?
        </p>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">
          ¿Listo para encontrar
          <br />
          tu par ideal?
        </h2>
        <p className="text-white/50 mb-10 max-w-sm mx-auto">
          Explora nuestra colección y encuentra los sneakers que llevas buscando.
        </p>
        <Link
          href="/catalog"
          className="inline-block bg-white text-black px-12 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white/90 transition-colors rounded"
        >
          Ver catálogo
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 text-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">
          © 2026 KicksHub — Tu tienda de sneakers de confianza
        </p>
      </footer>
    </div>
  );
}
