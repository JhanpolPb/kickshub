"use client"
import { useState, useEffect } from "react";
import api from "../../src/services/api";
import { addToCart } from "../../src/services/cartService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (e, id_product) => {
    e.preventDefault(); // evita que el Link navegue al hacer clic en el botón
    if (!user) {
      alert("Debes iniciar sesión para agregar al carrito");
      router.push("/login");
      return;
    }
    try {
      await addToCart(id_product);
      alert("Sneaker agregado al carrito ✅");
    } catch (err) {
      alert("Error al agregar al carrito");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando sneakers...</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1>Catálogo de Sneakers</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
        {products.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1rem", cursor: "pointer" }}>
              <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "4px" }} />
              <h3>{product.name}</h3>
              <p style={{ color: "#666" }}>{product.brand}</p>
              <p style={{ fontWeight: "bold" }}>${Number(product.price).toLocaleString("es-CO")}</p>
              <p style={{ color: "#999", fontSize: "0.9rem" }}>Stock: {product.stock}</p>
              <button
                onClick={(e) => handleAddToCart(e, product.id)}
                style={{ width: "100%", padding: "10px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "1rem" }}
              >
                Agregar al carrito
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}