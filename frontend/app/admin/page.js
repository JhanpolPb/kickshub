"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";
import api from "../../src/services/api";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "", brand: "", price: "", size: "", stock: "", image_url: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin") { router.push("/"); return; }
    fetchProducts();
  }, [user, authLoading]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      toast.error("Error cargando productos");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
      toast.success("Imagen subida correctamente");
    } catch {
      toast.error("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, form);
        toast.success("Producto actualizado");
      } else {
        await api.post("/products", form);
        toast.success("Producto creado");
      }
      resetForm();
      fetchProducts();
    } catch {
      toast.error("Error guardando el producto");
    }
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      size: product.size,
      stock: product.stock,
      image_url: product.image_url,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Producto eliminado");
      fetchProducts();
    } catch {
      toast.error("Error eliminando el producto");
    }
  };

  const resetForm = () => {
    setForm({ name: "", brand: "", price: "", size: "", stock: "", image_url: "" });
    setShowForm(false);
    setEditProduct(null);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

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
        <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-3">
          Administración
        </p>
        <h1 className="text-4xl font-black tracking-tight">Panel Admin</h1>
        <p className="text-white/40 text-sm mt-2">
          {products.length} productos en catálogo
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Acciones superiores */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-black/20 rounded px-4 py-2.5 text-sm placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
            />
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className={`px-5 py-2.5 font-bold text-sm rounded transition-all ${
              showForm
                ? "bg-black/10 text-black hover:bg-black/15"
                : "bg-black text-white hover:bg-black/80"
            }`}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo producto"}
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="border border-black/8 rounded-xl p-6 mb-8 bg-black/[0.01]">
            <h2 className="font-bold text-base mb-6">
              {editProduct ? `Editar: ${editProduct.name}` : "Nuevo producto"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label: "Nombre", key: "name", type: "text", placeholder: "Air Force 1" },
                  { label: "Marca", key: "brand", type: "text", placeholder: "Nike" },
                  { label: "Precio (COP)", key: "price", type: "number", placeholder: "450000" },
                  { label: "Talla", key: "size", type: "number", placeholder: "42" },
                  { label: "Stock", key: "stock", type: "number", placeholder: "10" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-black/50 mb-1.5">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      required
                      className="w-full border border-black/20 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Imagen */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wide text-black/50 mb-1.5">
                  Imagen
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="w-full border border-black/20 rounded px-4 py-2.5 text-sm file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-black file:text-white hover:file:bg-black/80 cursor-pointer"
                />
                {uploading && (
                  <p className="text-xs text-black/40 mt-2 flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin inline-block" />
                    Subiendo imagen...
                  </p>
                )}
                {form.image_url && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={form.image_url}
                      alt="preview"
                      className="w-16 h-16 object-cover rounded-lg border border-black/10"
                    />
                    <p className="text-xs text-green-600 font-medium">✓ Imagen lista</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-black text-white px-8 py-2.5 rounded font-bold text-sm hover:bg-black/80 transition-colors disabled:opacity-60 active:scale-[0.98]"
                >
                  {editProduct ? "Guardar cambios" : "Crear producto"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded border border-black/20 text-sm font-medium hover:bg-black/5 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div className="border border-black/8 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black/[0.02] border-b border-black/8">
                <tr>
                  {["#", "Imagen", "Nombre", "Marca", "Precio", "Talla", "Stock", "Acciones"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold tracking-widest uppercase text-black/40"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-black/[0.01] transition-colors">
                    <td className="px-4 py-3 text-black/30 text-xs">{product.id}</td>
                    <td className="px-4 py-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-lg bg-black/[0.03]"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-black/[0.03] rounded-lg flex items-center justify-center text-lg">
                          👟
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium max-w-[180px] truncate">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-black/60">{product.brand}</td>
                    <td className="px-4 py-3 font-bold">
                      ${Number(product.price).toLocaleString("es-CO")}
                    </td>
                    <td className="px-4 py-3 text-black/60">{product.size}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          product.stock === 0
                            ? "bg-red-50 text-red-600"
                            : product.stock <= 3
                            ? "bg-amber-50 text-amber-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-xs font-bold px-3 py-1.5 bg-black text-white rounded hover:bg-black/75 transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-xs font-bold px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-black/30 text-sm">
              No se encontraron productos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
