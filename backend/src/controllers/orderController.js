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