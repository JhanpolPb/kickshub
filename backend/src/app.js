require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("./config/database");

const productRoutes = require("./routes/productRoutes");
const authRoutes    = require("./routes/authRoutes");
const userRoutes    = require("./routes/userRoutes");
const cartRoutes    = require("./routes/cartRoutes");
const orderRoutes   = require("./routes/orderRoutes");
const reviewRoutes  = require("./routes/reviewRoutes");
const uploadRoutes  = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet());


const allowedOrigins = [
  "https://kickshub-frontend.onrender.com",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]
    : []),
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(s => s.trim()) : []),
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, apps móviles, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS bloqueado: ${origin}`));
  },
  credentials: true,
}));

// ── Rate limiting global ──
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,                  // max 200 requests por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes, intenta más tarde" },
}));

// ── Rate limiting estricto para auth (anti fuerza bruta) ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,                   // max 10 intentos de login/registro
  message: { error: "Demasiados intentos, espera 15 minutos" },
});

app.use(express.json({ limit: "10kb" })); // Limitar tamaño del body

// ── Health check ──
app.get("/", (_req, res) => {
  res.json({
    message: "Bienvenido a KicksHub API",
    description: "Tu tienda de Sneakers de confianza",
    version: "1.0.0",
  });
});

// ── Rutas ──
app.use("/api/products", productRoutes);
app.use("/api/auth",     authLimiter, authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/cart",     cartRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/reviews",  reviewRoutes);
app.use("/api/upload",   uploadRoutes);

// ── Error handler global ──
app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err.message.startsWith("CORS bloqueado")) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
