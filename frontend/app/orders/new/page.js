"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createOrder } from "../../../src/services/orderService";
import { getCart } from "../../../src/services/cartService";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    getCart()
      .then((data) => setCart(data))
      .catch(() => toast.error("Error cargando el carrito"))
      .finally(() => setCartLoading(false));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await createOrder();
      toast.success("¡Orden creada exitosamente! 🎉");
      router.push("/orders");
    } catch (err) {
      toast.error("Error al crear la orden");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Último paso
        </p>
        <h1 className="text-4xl font-black tracking-tight">Confirmar compra</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Resumen de items */}
        {!cartLoading && cart.length > 0 && (
          <div className="border border-black/8 rounded-xl overflow-hidden mb-6">
            <div className="bg-black/[0.02] px-5 py-3 border-b border-black/8">
              <p className="text-xs font-semibold tracking-widest uppercase text-black/50">
                Tu pedido
              </p>
            </div>
            <div className="divide-y divide-black/5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-black/40">×{item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-black text-white px-5 py-4 flex justify-between items-center">
              <span className="font-bold">Total</span>
              <span className="font-black text-xl">
                ${total.toLocaleString("es-CO")}
              </span>
            </div>
          </div>
        )}

        <p className="text-black/50 text-sm text-center mb-8">
          Al confirmar, los productos de tu carrito serán procesados y tu orden quedará registrada.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/cart"
            className="flex-1 text-center border border-black/20 text-black py-3.5 font-bold text-sm tracking-wide rounded hover:bg-black/5 transition-colors"
          >
            ← Volver al carrito
          </Link>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-black text-white py-3.5 font-bold text-sm tracking-widest uppercase rounded hover:bg-black/80 transition-colors disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : (
              "Confirmar orden"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
