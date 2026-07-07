const pool = require("../config/database");

const getOrders = async (req,res) => {
    try{
        const result = await pool.query ("SELECT * FROM orders WHERE id_user = $1 ORDER BY created_at DESC",[req.user.id]);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({ error: "Error al obtener las ordenes" });
    }
};

const getOrderById = async (req, res) => {
    try{
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
        
        if(result.rows.length === 0){
            return res.status(404).json({ error: "Orden no encontrada" });
        }

        const items = await pool.query(
            `SELECT order_items.*, products.name, products.image_url 
             FROM order_items 
             JOIN products ON order_items.id_product = products.id 
             WHERE order_items.id_order = $1`,
            [id]
        );

        res.json({
            ...result.rows[0],
            items: items.rows
        });

    }catch(err){
        res.status(500).json({ error: "Error al obtener la orden" });
    }
};

const createOrder = async (req, res) => {
    try{
        const cartItems = await pool.query(
            `SELECT cart_items.*, products.price 
             FROM cart_items 
             JOIN products ON cart_items.id_product = products.id
             WHERE cart_items.id_user = $1`,
            [req.user.id]
        );

        if(cartItems.rows.length === 0){
            return res.status(400).json({ error: "El carrito esta vacio" });
        }
        const total = cartItems.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const order = await pool.query("INSERT INTO orders (id_user,total) VALUES ($1,$2) RETURNING *",[req.user.id,total]);

        for (const item of cartItems.rows){
            await pool.query("INSERT INTO order_items (id_order, id_product, quantity, price) VALUES ($1,$2,$3,$4)",
            [order.rows[0].id, item.id_product, item.quantity, item.price]);
        }
        await pool.query ("DELETE FROM cart_items WHERE id_user = $1", [req.user.id]);

        res.status(200).json({ message: "Orden creada exitosamente", order: order.rows[0] });
    }catch(err){
        res.status(500).json({ error: "Error al crear la orden" });
    }
};

module.exports = {
    getOrders,
    getOrderById,
    createOrder
};