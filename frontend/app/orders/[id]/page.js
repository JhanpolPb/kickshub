"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getOrderById } from "../../../src/services/orderService";
import { useAuth } from "../../../src/context/authContext";
import { useRouter } from "next/navigation";

const statusConfig = {
  pending:   { label: "Pendiente",  classes: "bg-amber-50 text-amber-700 border border-amber-200" },
  confirmed: { label: "Confirmada", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
  shipped:   { label: "Enviada",    classes: "bg-purple-50 text-purple-700 border border-purple-200" },
  delivered: { label: "Entregada",  classes: "bg-green-50 text-green-700 border border-green-200" },
  cancelled: { label: "Cancelada",  classes: "bg-red-50 text-red-700 border border-red-200" },
};

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    getOrderById(id)
      .then((data) => setOrder(data))
      .catch(() => toast.error("No se pudo cargar la orden"))
      .finally(() => setLoading(false));
  }, [user, authLoading, id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">📦</p>
        <p className="text-lg font-medium text-black/50">Orden no encontrada</p>
        <Link href="/orders" className="text-sm underline underline-offset-4">
          ← Volver a mis órdenes
        </Link>
      </div>
    );
  }

  const status = statusConfig[order.state] || statusConfig.pending;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Detalle
        </p>
        <h1 className="text-4xl font-black tracking-tight">Orden #{order.id}</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black transition-colors mb-8"
        >
          ← Mis órdenes
        </Link>

        {/* Estado y fecha */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${status.classes}`}>
            {status.label}
          </span>
          <span className="text-sm text-black/40">
            {new Date(order.created_at).toLocaleDateString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Productos */}
        <div className="border border-black/8 rounded-xl overflow-hidden mb-6">
          <div className="bg-black/[0.02] px-5 py-3 border-b border-black/8">
            <p className="text-xs font-semibold tracking-widest uppercase text-black/50">
              Productos
            </p>
          </div>

          <div className="divide-y divide-black/5">
            {order.items &&
              order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg bg-black/[0.03] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-black/[0.03] rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                      👟
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-black/40 mt-0.5">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-black text-base flex-shrink-0">
                    ${(item.price * item.quantity).toLocaleString("es-CO")}
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-black text-white rounded-xl px-6 py-5 flex justify-between items-center">
          <span className="font-bold">Total pagado</span>
          <span className="font-black text-2xl">
            ${Number(order.total).toLocaleString("es-CO")}
          </span>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/catalog"
            className="text-sm text-black/40 hover:text-black transition-colors underline underline-offset-4"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}
