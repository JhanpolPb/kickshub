const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    }catch (err) {
    res.status(500).json({ error: "Error en el registro" });
    }
}
