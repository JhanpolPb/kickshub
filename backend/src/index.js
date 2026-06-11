const express = require("express");

const app = express();
const PORT = 3000;

app.get("/",(req,res) => {
    res.json({
        message:"Bienvenido a KicksHub API"
    })

})

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
})