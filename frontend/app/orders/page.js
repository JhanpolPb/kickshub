"use client";

import { useState, useEffect } from "react";
import { getOrders } from "../../src/services/orderService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    getOrders()
      .then((data) => setOrders(data))
      .catch((err) => console.log(err))
      .finally(() => setCartLoading(false));
  }, [user, loading]);

  if (cartLoading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando órdenes...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Mis Órdenes </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p>No tienes órdenes aún</p>
          <Link href="/catalog" style={{ marginTop: "1rem", display: "inline-block", padding: "10px 20px", background: "#000", color: "#fff", borderRadius: "4px", textDecoration: "none" }}>
            Ver catálogo
          </Link>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0 }}>Orden #{order.id}</h3>
                <p style={{ color: "#666", margin: "4px 0" }}>
                  {new Date(order.created_at).toLocaleDateString("es-CO")}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{
                  background: order.state === "pending" ? "#fff3cd" : "#d4edda",
                  color: order.state === "pending" ? "#856404" : "#155724",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85rem"
                }}>
                  {order.state === "pending" ? "Pendiente" : order.state}
                </span>
                <p style={{ fontWeight: "bold", margin: "8px 0 0" }}>
                  ${Number(order.total).toLocaleString("es-CO")}
                </p>
              </div>
            </div>
            <Link href={`/orders/${order.id}`} style={{ display: "inline-block", marginTop: "1rem", color: "#000", textDecoration: "underline" }}>
              Ver detalle 
            </Link>
          </div>
        ))
      )}
    </div>
  );
}