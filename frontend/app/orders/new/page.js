"use client";

import { useState } from "react";
import { createOrder } from "../../../src/services/orderService";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createOrder();
      alert("¡Orden creada exitosamente! 🎉");
      router.push("/orders");
    } catch (err) {
      alert("Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "100px auto", padding: "2rem", textAlign: "center" }}>
      <h1>Confirmar compra</h1>
      <p style={{ color: "#666" }}>¿Estás seguro que deseas confirmar tu orden?</p>
      <p style={{ color: "#666" }}>Los productos de tu carrito serán procesados.</p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <button
          onClick={() => router.push("/cart")}
          style={{ flex: 1, padding: "12px", background: "#fff", border: "1px solid #000", borderRadius: "4px", cursor: "pointer" }}
        >
          Volver al carrito
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          style={{ flex: 1, padding: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {loading ? "Procesando..." : "Confirmar orden"}
        </button>
      </div>
    </div>
  );
}