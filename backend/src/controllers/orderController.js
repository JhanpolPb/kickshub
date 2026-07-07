const pool = require("../config/database");

const getOrders = async (req,res) => {
    try{
        const result = await pool.query ("SELECT * FROM orders WHERE id_user = $1 ORDER BY created_at DESC",[req.user.id]);
        res.json(result.rows);

    }catch(err){
        res.status(500).json({ error: "Error al obtener las ordenes" });
    }
};