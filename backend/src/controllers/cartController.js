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
    try{

    }catch(err){


    }
};

