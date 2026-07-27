"use client";

import { useState, useEffect, use } from "react";
import { getOrderById } from "../../../src/services/orderService";
import { useAuth } from "../../../src/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage({ params }) {
  const { id } = use(params); // ← así se desenvuelve en Next.js 15
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch((err) => console.log("Error:", err.response?.data))
      .finally(() => setLoading(false));
  }, [user, authLoading, id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando orden...</p>;
  if (!order) return <p style={{ textAlign: "center", marginTop: "100px" }}>Orden no encontrada</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <Link href="/orders" style={{ color: "#000", textDecoration: "none", fontSize: "0.9rem" }}>
        ← Volver a mis órdenes
      </Link>

      <h1 style={{ marginTop: "1rem" }}>Orden #{order.id}</h1>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
        <span style={{
          background: order.state === "pending" ? "#fff3cd" : "#d4edda",
          color: order.state === "pending" ? "#856404" : "#155724",
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.85rem"
        }}>
          {order.state === "pending" ? "Pendiente" : order.state}
        </span>
        <span style={{ color: "#666", fontSize: "0.9rem" }}>
          {new Date(order.created_at).toLocaleDateString("es-CO")}
        </span>
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: "8px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ padding: "1rem", borderBottom: "1px solid #eee", background: "#f9f9f9" }}>
          <h3 style={{ margin: 0 }}>Productos</h3>
        </div>
        {order.items && order.items.map((item) => (
          <div key={item.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
            borderBottom: "1px solid #eee"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {item.image_url && (
                <img src={item.image_url} alt={item.name} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }} />
              )}
              <div>
                <p style={{ margin: 0, fontWeight: "500" }}>{item.name}</p>
                <p style={{ margin: "4px 0 0", color: "#666", fontSize: "0.9rem" }}>Cantidad: {item.quantity}</p>
              </div>
            </div>
            <p style={{ fontWeight: "bold", margin: 0 }}>
              ${(item.price * item.quantity).toLocaleString("es-CO")}
            </p>
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Total</h2>
          <h2 style={{ margin: 0 }}>${Number(order.total).toLocaleString("es-CO")}</h2>
        </div>
      </div>
    </div>
  );
}