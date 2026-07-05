const pool = require("../config/database");

const getCart = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT cart_items.*, products.name, products.price, products.image_url FROM cart_items JOIN products ON cart_items.id_product = products.id WHERE cart_items.id_user = $1",
            [req.user.id]
        );
        res.json(result.rows);

    }catch{
        res.status(500).json({ error: "Error obteniendo carrito"});

    }
};
const addToCart = async (req, res) => {
    const { id_product, quantity} = req.body;
    try{
        const exists = await pool.query("SELECT * FROM cart_items WHERE id_user = $1 AND id_product = $2",[req.user.id, id_product]);

        if (exists.rows.length > 0){
            const result = await pool.query("UPDATE cart_items SET quantity = quantity + $1 WHERE id_user = $2 AND id_product = $3 RETURNING *",
            [quantity, req.user.id, id_product]);
            res.json(result.rows[0]);
        }else{
            const result = await pool.query("INSERT INTO cart_items (id_user, id_product, quantity) VALUES ($1,$2,$3) RETURNING *",
            [req.user.id, id_product, quantity]);
            res.status(201).json(result.rows[0]);
        }
      

    }catch(err){
        res.status(500).json({ error: "Error agregando al carrito"});
    }
};


const updateCart= async (req, res) => {
    const { quantity} = req.body;
    const { id } = req.params;
    try{
        const result = await pool.query (" UPDATE cart_items SET quantity = $1 WHERE id_user = $2 AND id_product = $3 RETURNING *",
        [quantity, req.user.id, id_product]);
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: "Error actualizando el carrito"});
    }
};

const removeFromCart = async (req, res) => {
    const {id} = req.params;
    try{
    const result = await pool.query ("DELETE FROM cart_items WHERE id_user = $1 AND id_product = $2 RETURNING *",
    [req.user.id, id]);
    
    if (result.rows.length ===0){
       return res.status(404).json({ error: "Producto no encontrado en el carrito"});
    }
    res.json({ message: "Producto eliminado del carrito"});
    }catch(err){
        res.status(500).json ({ error: "Error  eliminando productos del carrito"});
    }
};