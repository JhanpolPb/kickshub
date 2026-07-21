"use client";

import { useState, useEffect } from "react";
import { getCart, removeFromCart, clearCart } from "../../src/services/cartService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
const [cart, setCart] = useState([]);
const [cartLoading, setCartLoading] = useState(true);
const { user, loading } = useAuth();
const router = useRouter();
useEffect(() => {
  if (loading) return;
  if (!user) {
    router.push("/login");
    return;
  }
  getCart()
    .then((data) => setCart(data))
    .catch((err) => console.log(err))
    .finally(() => setCartLoading(false));
}, [user, loading]);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      setCart(cart.filter((item) => item.id !== id));
    } catch (err) {
      alert("Error al eliminar producto");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart([]);
    } catch (err) {
      alert("Error al vaciar carrito");
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

 if (cartLoading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando carrito...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <h1>Mi Carrito</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p>Tu carrito está vacío</p>
          <button
            onClick={() => router.push("/catalog")}
            style={{ marginTop: "1rem", padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Ver catálogo
          </button>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid #eee", borderRadius: "8px", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ margin: 0 }}>{item.name}</h3>
                <p style={{ margin: "4px 0", color: "#666" }}>Cantidad: {item.quantity}</p>
                <p style={{ margin: 0, fontWeight: "bold" }}>${(item.price * item.quantity).toLocaleString("es-CO")}</p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                style={{ padding: "8px 16px", background: "#ff4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Eliminar
              </button>
            </div>
          ))}

          <div style={{ borderTop: "2px solid #000", paddingTop: "1rem", marginTop: "1rem" }}>
            <h2>Total: ${total.toLocaleString("es-CO")}</h2>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                onClick={handleClear}
                style={{ flex: 1, padding: "12px", background: "#fff", border: "1px solid #000", borderRadius: "4px", cursor: "pointer" }}
              >
                Vaciar carrito
              </button>
              <button
                onClick={() => router.push("/orders/new")}
                style={{ flex: 1, padding: "12px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Confirmar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}