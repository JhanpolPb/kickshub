require (dotenv).config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/",(req,res) => {
    res.json({
        message:"Bienvenido a KicksHub API"
    })

})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})