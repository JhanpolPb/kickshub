"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "../../../src/context/authContext";
import { useRouter } from "next/navigation";
import { addToCart } from "../../../src/services/cartService";
import api from "../../../src/services/api";
import Link from "next/link";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!selectedSize) {
      alert("Por favor selecciona una talla");
      return;
    }
    try {
      await addToCart(product.id, 1);
      alert("Sneaker agregado al carrito ✅");
    } catch (err) {
      alert("Error al agregar al carrito");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando...</p>;
  if (!product) return <p style={{ textAlign: "center", marginTop: "100px" }}>Producto no encontrado</p>;

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <Link href="/catalog" style={{ color: "#000", textDecoration: "none", fontSize: "0.9rem" }}>
        ← Volver al catálogo
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginTop: "2rem" }}>
        {/* Imagen */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            style={{ width: "100%", borderRadius: "12px", objectFit: "cover" }}
          />
        </div>

        {/* Info */}
        <div>
          <p style={{ color: "#999", fontSize: "0.85rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            {product.brand}
          </p>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0" }}>
            {product.name}
          </h1>
          <p style={{ fontSize: "1.8rem", fontWeight: "bold", margin: "1rem 0" }}>
            ${Number(product.price).toLocaleString("es-CO")}
          </p>

          {/* Selector de tallas */}
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <p style={{ fontWeight: "500", margin: 0 }}>Selecciona tu talla</p>
              <a href="#" style={{ color: "#666", fontSize: "0.85rem" }}>Guía de tallas</a>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    border: selectedSize === size ? "2px solid #000" : "1px solid #ddd",
                    background: selectedSize === size ? "#000" : "#fff",
                    color: selectedSize === size ? "#fff" : "#000",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    transition: "all 0.15s"
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "1rem" }}>
            Stock disponible: {product.stock} unidades
          </p>

          {/* Botón agregar */}
          <button
            onClick={handleAddToCart}
            style={{
              width: "100%",
              padding: "16px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1.5rem",
              letterSpacing: "0.05em"
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}