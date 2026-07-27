import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "#000",
        color: "#fff",
        minHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem"
      }}>
        <p style={{ letterSpacing: "0.3em", fontSize: "0.85rem", opacity: 0.6, marginBottom: "1rem" }}>
          New collection
        </p>
        <h1 style={{ fontSize: "4rem", fontWeight: "bold", margin: "0 0 1rem", lineHeight: 1.1 }}>
          KICKS<br />HUB
        </h1>
        <p style={{ fontSize: "1.2rem", opacity: 0.7, maxWidth: "400px", marginBottom: "2.5rem" }}>
          Los mejores sneakers en un solo lugar. Autenticidad garantizada.
        </p>
        <Link href="/catalog" style={{
          background: "#fff",
          color: "#000",
          padding: "16px 48px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "1rem",
          letterSpacing: "0.1em"
        }}>
          SHOP NOW
        </Link>
      </div>

      {/* Marcas */}
      <div style={{
        padding: "3rem 2rem",
        textAlign: "center",
        borderBottom: "1px solid #eee"
      }}>
        <p style={{ color: "#999", fontSize: "0.85rem", letterSpacing: "0.2em", marginBottom: "2rem" }}>
          BRANDS
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", flexWrap: "wrap" }}>
          {["Nike", "Adidas", "Jordan", "Louis Vuitton"].map((brand) => (
            <span key={brand} style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#ccc" }}>
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "0",
        borderBottom: "1px solid #eee"
      }}>
        {[
          {title: "100% Auténticos", desc: "Todos nuestros productos son originales y verificados" },
          {title: "Envío rápido", desc: "Recibe tus sneakers en la puerta de tu casa" },
          {title: "Devoluciones", desc: "30 días para cambios y devoluciones sin preguntas" }
        ].map((item) => (
          <div key={item.title} style={{
            padding: "3rem 2rem",
            textAlign: "center",
            borderRight: "1px solid #eee"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
            <h3 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>{item.title}</h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA final */}
      <div style={{
        padding: "5rem 2rem",
        textAlign: "center",
        background: "#f9f9f9"
      }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
          ¿Listo para encontrar tu par ideal?
        </h2>
        <p style={{ color: "#666", marginBottom: "2rem" }}>
          Explora nuestra colección y encuentra los sneakers que buscas
        </p>
        <Link href="/catalog" style={{
          background: "#000",
          color: "#fff",
          padding: "14px 40px",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold"
        }}>
          Ver catálogo
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        background: "#000",
        color: "#fff",
        padding: "2rem",
        textAlign: "center",
        opacity: 0.8,
        fontSize: "0.85rem"
      }}>
        © 2026 KicksHub — Tu tienda de sneakers de confianza
      </footer>
    </div>
  );
}