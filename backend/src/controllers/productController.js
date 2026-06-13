const pool = require("../config/database");

const getProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo producto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, brand, price, size, stock, image_url } = req.body;
    const result = await pool.query(
      "INSERT INTO products (name, brand, price, size, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [name, brand, price, size, stock, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error creando producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, brand, price, size, stock, image_url } = req.body;
    const result = await pool.query(
      "UPDATE products SET name=$1, brand=$2, price=$3, size=$4, stock=$5, image_url=$6 WHERE id=$7 RETURNING *",
      [name, brand, price, size, stock, image_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Error actualizando producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM products WHERE id=$1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };