"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getOrders } from "../../src/services/orderService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

const statusConfig = {
  pending:   { label: "Pendiente",  classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmada", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  shipped:   { label: "Enviada",    classes: "bg-purple-50 text-purple-700 border border-purple-200" },
  delivered: { label: "Entregada",  classes: "bg-green-50 text-green-700 border border-green-200" },
  cancelled: { label: "Cancelada",  classes: "bg-red-50 text-red-700 border border-red-200" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    getOrders()
      .then((data) => setOrders(data))
      .catch(() => toast.error("Error cargando órdenes"))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">Historial</p>
        <h1 className="text-4xl font-black tracking-tight">Mis Órdenes</h1>
        {orders.length > 0 && (
          <p className="text-white/40 text-sm mt-2">
            {orders.length} {orders.length === 1 ? "orden" : "órdenes"}
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-7xl mb-6">📦</p>
            <h2 className="text-2xl font-bold mb-3">Sin órdenes aún</h2>
            <p className="text-black/40 mb-8">
              Cuando hagas tu primera compra, aparecerá aquí.
            </p>
            <Link
              href="/catalog"
              className="inline-block bg-black text-white px-10 py-4 font-bold text-sm tracking-widest uppercase hover:bg-black/80 transition-colors rounded"
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.state] || statusConfig.pending;
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="block border border-black/8 rounded-xl p-5 hover:border-black/25 hover:shadow-lg hover:shadow-black/5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-black/40 text-xs font-semibold tracking-widest uppercase mb-1">
                        Orden #{order.id}
                      </p>
                      <p className="text-sm text-black/50">
                        {new Date(order.created_at).toLocaleDateString("es-CO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.classes}`}>
                        {status.label}
                      </span>
                      <div className="text-right">
                        <p className="font-black text-lg">
                          ${Number(order.total).toLocaleString("es-CO")}
                        </p>
                      </div>
                      <span className="text-black/20 group-hover:text-black/60 transition-colors text-xl">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
