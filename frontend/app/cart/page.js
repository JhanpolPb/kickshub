"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  getCart,
  removeFromCart,
  clearCart,
  updateCartItem,
} from "../../src/services/cartService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    getCart()
      .then((data) => setCart(data))
      .catch(() => toast.error("Error cargando el carrito"))
      .finally(() => setCartLoading(false));
  }, [user, loading]);

  const handleRemove = async (id, name) => {
    setRemovingId(id);
    try {
      await removeFromCart(id);
      setCart((prev) => prev.filter((item) => item.id !== id));
      toast.success(`${name} eliminado del carrito`);
    } catch {
      toast.error("Error al eliminar el producto");
    } finally {
      setRemovingId(null);
    }
  };

  const handleUpdateQty = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      await updateCartItem(item.id, newQty);
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    } catch {
      toast.error("Error actualizando cantidad");
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      setCart([]);
      toast.success("Carrito vaciado");
    } catch {
      toast.error("Error al vaciar el carrito");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/50 text-sm">Cargando carrito...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Resumen
        </p>
        <h1 className="text-4xl font-black tracking-tight">Mi Carrito</h1>
        {cart.length > 0 && (
          <p className="text-white/40 text-sm mt-2">
            {itemCount} {itemCount === 1 ? "producto" : "productos"}
          </p>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {cart.length === 0 ? (
          /* Carrito vacío */
          <div className="text-center py-24">
            <p className="text-7xl mb-6">🛒</p>
            <h2 className="text-2xl font-bold mb-3">Tu carrito está vacío</h2>
            <p className="text-black/40 mb-8">
              Agrega algunos sneakers increíbles
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-black text-white px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition-colors rounded"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border border-black/8 rounded-xl p-4 hover:border-black/20 transition-colors"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-black/[0.03] rounded-lg overflow-hidden flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👟
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-black/40 text-xs font-semibold tracking-widest uppercase">
                      {item.brand}
                    </p>
                    <h3 className="font-bold text-sm mt-0.5 truncate">
                      {item.name}
                    </h3>

                    {/* Cantidad */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-black/15 rounded">
                        <button
                          onClick={() => handleUpdateQty(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black disabled:opacity-30 transition-colors text-lg"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(item, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-black/50 hover:text-black transition-colors text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Precio + eliminar */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-black text-base">
                      ${(item.price * item.quantity).toLocaleString("es-CO")}
                    </p>
                    <button
                      onClick={() => handleRemove(item.id, item.name)}
                      disabled={removingId === item.id}
                      className="text-black/25 hover:text-red-500 transition-colors text-xs"
                    >
                      {removingId === item.id ? "..." : "Eliminar"}
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={handleClear}
                className="text-sm text-black/40 hover:text-red-500 transition-colors underline underline-offset-4 mt-2"
              >
                Vaciar todo el carrito
              </button>
            </div>

            {/* Resumen de compra */}
            <div className="lg:col-span-1">
              <div className="border border-black/8 rounded-xl p-6 sticky top-24">
                <h2 className="font-bold text-base mb-6">Resumen</h2>

                <div className="space-y-3 text-sm border-b border-black/8 pb-4 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-black/60">
                      <span className="truncate mr-2">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="flex-shrink-0 font-medium">
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-bold">Total</span>
                  <span className="font-black text-xl">
                    ${total.toLocaleString("es-CO")}
                  </span>
                </div>

                <button
                  onClick={() => router.push("/orders/new")}
                  className="w-full bg-black text-white py-4 font-bold text-sm tracking-widest uppercase rounded hover:bg-black/80 transition-colors active:scale-[0.98]"
                >
                  Confirmar compra
                </button>

                <Link
                  href="/catalog"
                  className="block text-center text-sm text-black/40 hover:text-black transition-colors mt-4"
                >
                  ← Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
