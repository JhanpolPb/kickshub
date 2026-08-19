"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import api from "../../src/services/api";
import { addToCart } from "../../src/services/cartService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterBrand, setFilterBrand] = useState("Todas");
  const [addingId, setAddingId] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Error cargando productos"))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.brand))].sort();
    return ["Todas", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchBrand = filterBrand === "Todas" || p.brand === filterBrand;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [products, filterBrand, search]);

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Inicia sesión para agregar al carrito");
      router.push("/login");
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} agregado al carrito`);
    } catch (err) {
      toast.error("Error al agregar al carrito");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-12 px-4 text-center">
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Colección completa
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
          Catálogo
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar sneaker o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-black/20 rounded px-4 py-3 text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black/30 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por marca */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 flex-shrink-0">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-4 py-3 text-xs font-semibold tracking-wide rounded whitespace-nowrap transition-all duration-200 ${
                  filterBrand === brand
                    ? "bg-black text-white"
                    : "bg-black/5 text-black/60 hover:bg-black/10"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        {!loading && (
          <p className="text-black/40 text-sm mb-6">
            {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
            {filterBrand !== "Todas" && ` · ${filterBrand}`}
            {search && ` · "${search}"`}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">👟</p>
            <p className="text-black/50 text-lg font-medium">
              No encontramos resultados
            </p>
            <button
              onClick={() => { setSearch(""); setFilterBrand("Todas"); }}
              className="mt-4 text-sm text-black underline underline-offset-4"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingId === product.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, onAddToCart, isAdding }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group border border-black/8 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300">
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

        {/* Badge stock bajo */}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            ¡Últimas {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-black/50 font-bold text-sm">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-black/40 text-xs font-semibold tracking-widest uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="font-bold text-sm leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-black/40 text-xs mb-3">Talla {product.size}</p>

        <div className="flex items-center justify-between">
          <span className="font-black text-lg">
            ${Number(product.price).toLocaleString("es-CO")}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isAdding || product.stock === 0}
            className={`text-xs font-bold px-4 py-2 rounded transition-all duration-200 ${
              product.stock === 0
                ? "bg-black/10 text-black/30 cursor-not-allowed"
                : isAdding
                ? "bg-black/70 text-white cursor-wait"
                : "bg-black text-white hover:bg-black/80 active:scale-95"
            }`}
          >
            {isAdding ? "..." : product.stock === 0 ? "Agotado" : "+ Carrito"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-black/8 rounded-xl overflow-hidden animate-pulse">
      <div className="bg-black/5 aspect-square" />
      <div className="p-4 space-y-2">
        <div className="bg-black/5 h-3 w-16 rounded" />
        <div className="bg-black/5 h-4 w-3/4 rounded" />
        <div className="bg-black/5 h-3 w-12 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="bg-black/5 h-6 w-20 rounded" />
          <div className="bg-black/5 h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}
