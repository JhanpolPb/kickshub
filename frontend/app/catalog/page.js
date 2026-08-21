"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import api from "../../src/services/api";
import { addToCart } from "../../src/services/cartService";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";

const SORT_OPTIONS = [
  { value: "newest",     label: "Más recientes" },
  { value: "price_asc",  label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "name_asc",   label: "Nombre: A–Z" },
];

const PRICE_RANGES = [
  { label: "Todos",          min: 0,       max: Infinity },
  { label: "< $300K",        min: 0,       max: 300000 },
  { label: "$300K – $600K",  min: 300000,  max: 600000 },
  { label: "$600K – $1M",    min: 600000,  max: 1000000 },
  { label: "> $1M",          min: 1000000, max: Infinity },
];

export default function CatalogPage() {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [filterBrand, setFilterBrand] = useState("Todas");
  const [priceRange, setPriceRange] = useState(0);          // índice en PRICE_RANGES
  const [sortBy, setSortBy]         = useState("newest");
  const [addingId, setAddingId]     = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get("/products")
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Error cargando productos"))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => {
    const unique = [...new Set(products.map((p) => p.brand))].sort();
    return ["Todas", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceRange];
    let result = products.filter((p) => {
      const matchBrand = filterBrand === "Todas" || p.brand === filterBrand;
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const price = Number(p.price);
      const matchPrice = price >= range.min && price < range.max;
      return matchBrand && matchSearch && matchPrice;
    });

    switch (sortBy) {
      case "price_asc":  result = [...result].sort((a, b) => a.price - b.price); break;
      case "price_desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "name_asc":   result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break; // newest = DB order
    }
    return result;
  }, [products, filterBrand, search, priceRange, sortBy]);

  const handleAddToCart = async (product, e) => {
    e.preventDefault();   // evitar navegar al detalle
    e.stopPropagation();
    if (!user) {
      toast.error("Inicia sesión para agregar al carrito");
      router.push("/login");
      return;
    }
    setAddingId(product.id);
    try {
      await addToCart(product.id);
      toast.success(`${product.name} agregado`);
    } catch {
      toast.error("Error al agregar al carrito");
    } finally {
      setAddingId(null);
    }
  };

  const hasActiveFilters =
    filterBrand !== "Todas" || priceRange !== 0 || search !== "";

  const clearFilters = () => {
    setSearch("");
    setFilterBrand("Todas");
    setPriceRange(0);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-black text-white py-14 px-4 text-center">
        <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-3">
          Colección completa
        </p>
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter">Catálogo</h1>
        {!loading && (
          <p className="text-white/30 text-sm mt-3">
            {products.length} modelos disponibles
          </p>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Barra de búsqueda + controles ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar sneaker o marca..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-black/15 rounded-lg pl-10 pr-10 py-3 text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors bg-white"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors text-lg leading-none">
                ×
              </button>
            )}
          </div>

          {/* Ordenar */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Toggle filtros mobile */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`sm:hidden flex items-center gap-2 border rounded-lg px-4 py-3 text-sm font-medium transition-colors ${filtersOpen ? "bg-black text-white border-black" : "border-black/15 text-black"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Filtros
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-black/50 inline-block" />}
          </button>
        </div>

        {/* ── Filtros ── */}
        <div className={`${filtersOpen ? "block" : "hidden"} sm:block mb-6`}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Marcas */}
            <div className="w-full sm:w-auto">
              <p className="text-[10px] font-bold tracking-widest uppercase text-black/35 mb-2">Marca</p>
              <div className="flex flex-wrap gap-2">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setFilterBrand(brand)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      filterBrand === brand
                        ? "bg-black text-white"
                        : "bg-black/5 text-black/55 hover:bg-black/10"
                    }`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </div>

            {/* Separador vertical */}
            <div className="hidden sm:block w-px bg-black/8 self-stretch mx-2" />

            {/* Precio */}
            <div className="w-full sm:w-auto">
              <p className="text-[10px] font-bold tracking-widest uppercase text-black/35 mb-2">Precio</p>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => setPriceRange(i)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      priceRange === i
                        ? "bg-black text-white"
                        : "bg-black/5 text-black/55 hover:bg-black/10"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contador + clear */}
        <div className="flex items-center justify-between mb-6">
          {!loading && (
            <p className="text-black/35 text-sm">
              {filtered.length} {filtered.length === 1 ? "producto" : "productos"}
              {filterBrand !== "Todas" && ` · ${filterBrand}`}
              {search && ` · "${search}"`}
            </p>
          )}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-black/40 hover:text-black underline underline-offset-4 transition-colors">
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-6xl mb-5">👟</p>
            <p className="text-black/40 text-xl font-medium mb-2">Sin resultados</p>
            <p className="text-black/25 text-sm mb-6">Prueba con otros filtros</p>
            <button onClick={clearFilters} className="text-sm font-bold border border-black/20 px-6 py-2.5 rounded-lg hover:bg-black hover:text-white transition-colors">
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
          <div className="w-full h-full flex items-center justify-center text-5xl text-black/10">👟</div>
        )}

        {/* Overlay al hover con "Ver detalle" */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
            Ver detalle →
          </span>
        </div>

        {/* Badges */}
        {product.stock > 0 && product.stock <= 3 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide">
            ¡Solo {product.stock}!
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
            <span className="text-black/40 font-black text-sm tracking-widest uppercase">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-black/35 text-[10px] font-black tracking-[0.25em] uppercase mb-1">
          {product.brand}
        </p>
        <h3 className="font-bold text-sm leading-snug mb-3 line-clamp-2 group-hover:underline underline-offset-2 transition-all">
          {product.name}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-black text-lg">${Number(product.price).toLocaleString("es-CO")}</span>
            <p className="text-black/30 text-xs mt-0.5">Talla {product.size}</p>
          </div>

          <button
            onClick={(e) => onAddToCart(product, e)}
            disabled={isAdding || product.stock === 0}
            className={`flex-shrink-0 text-xs font-black px-4 py-2.5 rounded-xl transition-all duration-200 ${
              product.stock === 0
                ? "bg-black/8 text-black/25 cursor-not-allowed"
                : isAdding
                ? "bg-black/60 text-white cursor-wait scale-95"
                : "bg-black text-white hover:bg-black/75 active:scale-95"
            }`}
          >
            {isAdding ? (
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
              </span>
            ) : product.stock === 0 ? "—" : "+ Carrito"}
          </button>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-black/8 rounded-2xl overflow-hidden animate-pulse">
      <div className="bg-black/[0.05] aspect-square" />
      <div className="p-4 space-y-2.5">
        <div className="bg-black/[0.05] h-2.5 w-14 rounded-full" />
        <div className="bg-black/[0.05] h-4 w-4/5 rounded" />
        <div className="bg-black/[0.05] h-3 w-10 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="bg-black/[0.05] h-7 w-24 rounded" />
          <div className="bg-black/[0.05] h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
