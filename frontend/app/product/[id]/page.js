"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "../../../src/context/authContext";
import { useRouter } from "next/navigation";
import { addToCart } from "../../../src/services/cartService";
import api from "../../../src/services/api";

export default function ProductDetailPage({ params }) {
  const { id } = use(params);
  const [product, setProduct]     = useState(null);
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [adding, setAdding]       = useState(false);
  const [quantity, setQuantity]   = useState(1);
  const [imgError, setImgError]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // Review form
  const [reviewForm, setReviewForm]       = useState({ calification: 5, comment: "" });
  const [submittingReview, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/${id}`).catch(() => ({ data: [] })),
    ])
      .then(([productRes, reviewsRes]) => {
        setProduct(productRes.data);
        setReviews(reviewsRes.data || []);
      })
      .catch(() => toast.error("Error cargando el producto"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Inicia sesión para agregar al carrito");
      router.push("/login");
      return;
    }
    if (product.stock === 0) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} agregado al carrito`);
    } catch {
      toast.error("Error al agregar al carrito");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error("Inicia sesión para dejar una reseña"); return; }
    if (!reviewForm.comment.trim()) { toast.error("Escribe un comentario"); return; }
    setSubmitting(true);
    try {
      const res = await api.post("/reviews", {
        id_product: Number(id),
        calification: reviewForm.calification,
        comment: reviewForm.comment.trim(),
      });
      setReviews((prev) => [res.data, ...prev]);
      setReviewForm({ calification: 5, comment: "" });
      setShowReviewForm(false);
      toast.success("Reseña publicada");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al publicar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("¿Eliminar esta reseña?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.id_review !== reviewId));
      toast.success("Reseña eliminada");
    } catch {
      toast.error("Error al eliminar la reseña");
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + Number(r.calification), 0) / reviews.length).toFixed(1)
    : null;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb skeleton */}
          <div className="bg-black/5 h-4 w-36 rounded animate-pulse mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <div className="bg-black/5 aspect-square rounded-2xl animate-pulse" />
            <div className="space-y-5 pt-4">
              <div className="bg-black/5 h-3 w-20 rounded animate-pulse" />
              <div className="bg-black/5 h-10 w-3/4 rounded animate-pulse" />
              <div className="bg-black/5 h-10 w-1/3 rounded animate-pulse" />
              <div className="bg-black/5 h-1 w-full rounded animate-pulse mt-6" />
              <div className="bg-black/5 h-14 w-full rounded-xl animate-pulse mt-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Not found ── */
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5">
        <p className="text-6xl">😔</p>
        <p className="text-xl font-bold">Producto no encontrado</p>
        <Link href="/catalog" className="text-sm underline underline-offset-4 text-black/50 hover:text-black">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const stockStatus =
    product.stock === 0
      ? { text: "Agotado", classes: "text-red-500" }
      : product.stock <= 3
      ? { text: `¡Solo ${product.stock} disponibles!`, classes: "text-amber-600" }
      : { text: `${product.stock} en stock`, classes: "text-green-600" };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/5 bg-black/[0.015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center gap-2 text-xs text-black/35">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-black transition-colors">Catálogo</Link>
          <span>/</span>
          <span className="text-black/60 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Imagen ── */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-black/[0.03] sticky top-24">
              {!imgError ? (
                <>
                  {!imgLoaded && (
                    <div className="absolute inset-0 bg-black/[0.05] animate-pulse rounded-2xl" />
                  )}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    onLoad={() => setImgLoaded(true)}
                    onError={() => setImgError(true)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                  />
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-black/20">
                  <span className="text-7xl">👟</span>
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}

              {/* Badge agotado sobre imagen */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                  <span className="text-black/40 font-black text-lg tracking-widest uppercase">Agotado</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Info ── */}
          <div className="flex flex-col">
            {/* Brand + badges */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-black/35 text-xs font-black tracking-[0.3em] uppercase">
                {product.brand}
              </span>
              {avgRating && (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5">
                  <StarIcon size={11} filled />
                  <span className="text-amber-700 text-xs font-bold">{avgRating}</span>
                  <span className="text-amber-500 text-xs">({reviews.length})</span>
                </div>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Precio */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black">
                ${Number(product.price).toLocaleString("es-CO")}
              </span>
              <span className="text-black/30 text-sm">COP</span>
            </div>

            <div className="h-px bg-black/8 mb-6" />

            {/* Talla */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-bold">Talla</p>
                <span className="text-black/50 text-xs font-bold tracking-wide px-3 py-1 border border-black/15 rounded-full">
                  EU {product.size}
                </span>
              </div>
            </div>

            {/* Cantidad */}
            <div className="mb-6">
              <p className="text-sm font-bold mb-3">Cantidad</p>
              <div className="flex items-center gap-0 border border-black/15 rounded-xl w-fit">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-11 h-11 flex items-center justify-center text-black/50 hover:text-black disabled:opacity-30 transition-colors text-xl"
                >
                  −
                </button>
                <span className="w-10 text-center font-black text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || product.stock === 0}
                  className="w-11 h-11 flex items-center justify-center text-black/50 hover:text-black disabled:opacity-30 transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <p className={`text-sm font-semibold mb-6 ${stockStatus.classes}`}>
              {stockStatus.text}
            </p>

            {/* Botón add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className={`w-full py-4 font-black text-sm tracking-widest uppercase rounded-xl transition-all duration-300 mb-3 ${
                product.stock === 0
                  ? "bg-black/8 text-black/25 cursor-not-allowed"
                  : adding
                  ? "bg-black/70 text-white cursor-wait"
                  : "bg-black text-white hover:bg-black/80 active:scale-[0.98] hover:shadow-lg hover:shadow-black/20"
              }`}
            >
              {adding ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Agregando...
                </span>
              ) : product.stock === 0 ? (
                "Sin stock"
              ) : (
                "Agregar al carrito"
              )}
            </button>

            {/* Ver carrito */}
            {user && (
              <Link
                href="/cart"
                className="w-full py-3.5 font-bold text-sm tracking-wide border border-black/15 rounded-xl text-center hover:bg-black/5 transition-colors"
              >
                Ver carrito
              </Link>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-black/5">
              {[
                { icon: "✓", label: "100% Auténtico" },
                { icon: "↩", label: "30 días devolución" },
                { icon: "🔒", label: "Pago seguro" },
              ].map((b) => (
                <div key={b.label} className="text-center">
                  <p className="text-base mb-1">{b.icon}</p>
                  <p className="text-black/40 text-[10px] leading-snug">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RESEÑAS ── */}
        <div className="mt-20 pt-12 border-t border-black/8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Reseñas</h2>
              {reviews.length > 0 && (
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={Number(avgRating)} />
                  <span className="text-black/40 text-sm">
                    {avgRating} de 5 · {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
                  </span>
                </div>
              )}
            </div>
            {user && !showReviewForm && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black/80 transition-colors self-start sm:self-auto"
              >
                + Escribir reseña
              </button>
            )}
          </div>

          {/* Formulario de reseña */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="border border-black/10 rounded-2xl p-6 mb-8 bg-black/[0.01]"
            >
              <h3 className="font-bold mb-5">Tu reseña</h3>

              {/* Estrellas */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-2 text-black/60">Calificación</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((f) => ({ ...f, calification: star }))}
                      className="transition-transform hover:scale-110"
                    >
                      <StarIcon size={28} filled={star <= reviewForm.calification} />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-black/40 self-center">
                    {reviewForm.calification}/5
                  </span>
                </div>
              </div>

              {/* Comentario */}
              <div className="mb-5">
                <p className="text-sm font-medium mb-2 text-black/60">Comentario</p>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                  placeholder="Cuéntanos tu experiencia con este sneaker..."
                  rows={4}
                  required
                  className="w-full border border-black/15 rounded-xl px-4 py-3 text-sm placeholder:text-black/25 focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-black text-white px-7 py-2.5 rounded-xl font-bold text-sm hover:bg-black/80 transition-colors disabled:opacity-60"
                >
                  {submittingReview ? "Publicando..." : "Publicar reseña"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-2.5 rounded-xl border border-black/15 text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Lista de reseñas */}
          {reviews.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-black/10 rounded-2xl">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-black/40 font-medium">Sin reseñas todavía</p>
              <p className="text-black/25 text-sm mt-1">Sé el primero en opinar</p>
              {user && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mt-5 text-sm font-bold underline underline-offset-4 text-black/50 hover:text-black transition-colors"
                >
                  Escribir reseña
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id_review}
                  review={review}
                  currentUser={user}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Volver al catálogo ── */}
        <div className="mt-16 text-center">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors"
          >
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Sub-componentes ─────────── */

function ReviewCard({ review, currentUser, onDelete }) {
  const isOwner = currentUser?.id === review.id_user || currentUser?.role === "admin";
  const date = new Date(review.created_at).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="border border-black/8 rounded-2xl p-5 hover:border-black/15 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar generado */}
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white text-xs font-black flex-shrink-0">
            {review.user_name ? review.user_name[0].toUpperCase() : "U"}
          </div>
          <div>
            <p className="font-bold text-sm">{review.user_name || "Usuario"}</p>
            <p className="text-black/30 text-xs">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StarRating rating={Number(review.calification)} size={13} />
          {isOwner && (
            <button
              onClick={() => onDelete(review.id_review)}
              className="text-black/25 hover:text-red-500 transition-colors text-xs"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-black/65 leading-relaxed">{review.comment}</p>
    </div>
  );
}

function StarRating({ rating, size = 15 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} size={size} filled={s <= Math.round(rating)} />
      ))}
    </div>
  );
}

function StarIcon({ size = 16, filled = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FBBF24" : "none"}
      stroke={filled ? "#FBBF24" : "#D1D5DB"}
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
