"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../src/context/authContext";
import { useRouter } from "next/navigation";
import api from "../../src/services/api";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({
    name: "", brand: "", price: "", size: "", stock: "", image_url: ""
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
    } catch (err) {
      console.log(err);
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
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((prev) => ({ ...prev, image_url: res.data.url }));
    } catch (err) {
      alert("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, form);
      } else {
        await api.post("/products", form);
      }
      setForm({ name: "", brand: "", price: "", size: "", stock: "", image_url: "" });
      setShowForm(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      alert("Error guardando producto");
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
      image_url: product.image_url
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Error eliminando producto");
    }
  };

  if (loading) return <p style={{ textAlign: "center", marginTop: "100px" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Panel Admin 🛠️</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: "", brand: "", price: "", size: "", stock: "", image_url: "" }); }}
          style={{ padding: "10px 20px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          {showForm ? "Cancelar" : "+ Agregar producto"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "1.5rem", marginBottom: "2rem" }}>
          <h2>{editProduct ? "Editar producto" : "Nuevo producto"}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Nombre", key: "name", type: "text" },
                { label: "Marca", key: "brand", type: "text" },
                { label: "Precio", key: "price", type: "number" },
                { label: "Talla", key: "size", type: "number" },
                { label: "Stock", key: "stock", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem" }}>{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                    style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              ))}
            </div>

            {/* Campo imagen */}
            <div style={{ marginTop: "1rem" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "0.9rem" }}>Imagen</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    handleImageUpload(file);
                  }
                }}
                style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: "4px" }}
              />
              {uploading && <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "4px" }}>Subiendo imagen...</p>}
              {form.image_url && (
                <img src={form.image_url} alt="preview" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", marginTop: "8px" }} />
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              style={{ marginTop: "1rem", padding: "10px 24px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
            >
              {editProduct ? "Guardar cambios" : "Crear producto"}
            </button>
          </form>
        </div>
      )}

      {/* Tabla de productos */}
      <div style={{ border: "1px solid #eee", borderRadius: "8px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#f9f9f9" }}>
            <tr>
              {["ID", "Nombre", "Marca", "Precio", "Talla", "Stock", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #eee", fontSize: "0.85rem" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>{product.id}</td>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>{product.name}</td>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>{product.brand}</td>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>${Number(product.price).toLocaleString("es-CO")}</td>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>{product.size}</td>
                <td style={{ padding: "12px", fontSize: "0.9rem" }}>{product.stock}</td>
                <td style={{ padding: "12px" }}>
                  <button
                    onClick={() => handleEdit(product)}
                    style={{ padding: "6px 12px", background: "#000", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "8px", fontSize: "0.85rem" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{ padding: "6px 12px", background: "#ff4444", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}