import Link from "next/link";

export const metadata = {
  title: "KicksHub — Sneakers Auténticos",
};

const brands = ["Nike", "Adidas", "Jordan", "New Balance", "Louis Vuitton"];

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    ),
    title: "100% Auténticos",
    desc: "Todos nuestros productos son originales y verificados. Cero replicas, cero dudas.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
    title: "Envío rápido",
    desc: "Recibe tus sneakers en la puerta de tu casa. Tracking en tiempo real.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
    ),
    title: "Devoluciones",
    desc: "30 días para cambios y devoluciones sin preguntas. Sin letra pequeña.",
  },
];

const stats = [
  { value: "500+", label: "Modelos disponibles" },
  { value: "10K+", label: "Clientes felices" },
  { value: "100%", label: "Autenticidad garantizada" },
  { value: "30d", label: "Garantía de devolución" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative bg-black text-white min-h-[94vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">

        {/* Orbes animados de fondo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-white/[0.03] animate-[spin_30s_linear_infinite]" />
          <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/[0.03] animate-[spin_40s_linear_infinite_reverse]" />
          {/* Grid de puntos */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Contenido hero */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/70 text-xs tracking-[0.2em] uppercase font-medium">
              Nueva colección 2026
            </span>
          </div>

          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-[0.9] mb-8 select-none">
            KICKS
            <br />
            <span className="text-white/15 hover:text-white/30 transition-colors duration-700">
              HUB
            </span>
          </h1>

          <p className="text-white/50 text-lg sm:text-xl max-w-lg mx-auto mb-12 leading-relaxed font-light">
            Los mejores sneakers en un solo lugar.
            <br />
            <span className="text-white/30">Autenticidad garantizada.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-4 font-bold text-sm tracking-widest uppercase rounded overflow-hidden transition-all duration-300 hover:pr-14"
            >
              <span>Shop Now</span>
              <span className="absolute right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">→</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center border border-white/25 text-white/80 px-10 py-4 font-medium text-sm tracking-widest uppercase rounded hover:bg-white/10 hover:text-white hover:border-white/50 transition-all duration-300"
            >
              Crear cuenta
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-[10px] tracking-[0.4em] uppercase">Scroll</span>
          <div className="relative w-px h-12 bg-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full bg-white/50 animate-scroll-down" style={{ height: "40%" }} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-black border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="px-8 py-10 text-center group">
              <p className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300 inline-block">
                {stat.value}
              </p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="border-y border-black/8 py-8 bg-white overflow-hidden">
        <p className="text-center text-black/25 text-[10px] tracking-[0.4em] uppercase mb-6">
          Marcas disponibles
        </p>
        {/* Ticker animado */}
        <div className="relative flex overflow-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {[...brands, ...brands].map((brand, i) => (
              <span
                key={i}
                className="text-2xl font-black text-black/15 hover:text-black/50 transition-colors duration-300 cursor-default flex-shrink-0"
              >
                {brand}
              </span>
            ))}
          </div>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 w-24 h-full bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          <div className="absolute right-0 top-0 w-24 h-full bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
        </div>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-black/30 text-xs tracking-[0.4em] uppercase mb-3">Por qué elegirnos</p>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
            La diferencia
            <br />
            <span className="text-black/20">KicksHub</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, i) => (
            <div
              key={item.title}
              className="group relative border border-black/8 rounded-2xl p-8 hover:border-black/25 hover:shadow-2xl hover:shadow-black/8 hover:-translate-y-2 transition-all duration-500 cursor-default"
            >
              {/* Número de fondo */}
              <span className="absolute top-6 right-8 text-8xl font-black text-black/[0.04] select-none group-hover:text-black/[0.07] transition-colors duration-500">
                0{i + 1}
              </span>

              <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-black text-lg mb-3">{item.title}</h3>
              <p className="text-black/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-black text-white py-32 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-white/30 text-[10px] tracking-[0.4em] uppercase mb-5">
            Ready to drop?
          </p>
          <h2 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
            ¿Listo para
            <br />
            tu próximo par?
          </h2>
          <p className="text-white/40 mb-12 text-lg font-light">
            Explora nuestra colección y encuentra los sneakers que llevas buscando.
          </p>
          <Link
            href="/catalog"
            className="group relative inline-flex items-center gap-3 bg-white text-black px-14 py-5 font-black text-sm tracking-widest uppercase rounded hover:bg-white/90 transition-all duration-300 overflow-hidden"
          >
            Ver catálogo
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/5 py-10">
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
