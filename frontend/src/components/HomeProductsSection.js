"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { addToCart } from "../services/cartService";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

export default function HomeProductsSection({ products }) {
  const [addingId, setAddingId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Inicia sesión para agregar al carrito");
      router.push("/login");
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} agregado al carrito`);
    } catch {
      toast.error("Error al agregar al carrito");
    } finally {
      setAddingId(null);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-black/30">
        <p className="text-4xl mb-3">👟</p>
        <p className="text-sm">Cargando colección...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          isAdding={addingId === product.id}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onAddToCart, isAdding }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group border border-black/8 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-1.5 transition-all duration-300 block bg-white"
    >
      {/* Imagen */}
      <div className="relative bg-black/[0.03] aspect-square overflow-hidden">
        {!imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-black/10">
            👟
          </div>
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/65 px-3 py-1.5 rounded-full backdrop-blur-sm">
            Ver detalle →
          </span>
        </div>

        {/* Badge stock */}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-black/40 font-black text-xs tracking-widest uppercase">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="text-black/30 text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase mb-0.5">
          {product.brand}
        </p>
        <h3 className="font-bold text-xs sm:text-sm leading-snug mb-2.5 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="font-black text-base sm:text-lg">
            ${Number(product.price).toLocaleString("es-CO")}
          </span>

          <button
            onClick={(e) => onAddToCart(product, e)}
            disabled={isAdding || product.stock === 0}
            className={`flex-shrink-0 text-[10px] sm:text-xs font-black px-3 sm:px-4 py-2 rounded-xl transition-all duration-200 ${
              product.stock === 0
                ? "bg-black/8 text-black/20 cursor-not-allowed"
                : isAdding
                ? "bg-black/60 text-white cursor-wait"
                : "bg-black text-white hover:bg-black/75 active:scale-95"
            }`}
          >
            {isAdding ? (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : product.stock === 0 ? "—" : "+ Carrito"}
          </button>
        </div>
      </div>
    </Link>
  );
}
