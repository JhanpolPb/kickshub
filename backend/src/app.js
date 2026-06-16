require('dotenv').config();
const express = require("express");
require("./config/database");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/",(req,res) => {
    res.json({
        message:"Bienvenido a KicksHub API"});
    });

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})