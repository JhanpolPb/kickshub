const pool = require('../config/datbase');

const getReviews = async (req,res) => {
    try{
        const result = await pool.query ("SELECT * FROM reviews WHERE id_product = $1", [req.params.id_product]);
        res.json(result.rows);
    }catch(err){
        res.status(500).json ({ error: "Error al obtener las reseñas"});
    }
};
