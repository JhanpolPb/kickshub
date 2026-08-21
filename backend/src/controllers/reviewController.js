const pool = require('../config/database');

const getReviews = async (req,res) => {
    try{
        const result = await pool.query(
            `SELECT r.*, u.name AS user_name
             FROM reviews r
             LEFT JOIN users u ON r.id_user = u.id
             WHERE r.id_product = $1
             ORDER BY r.created_at DESC`,
            [req.params.id]
        );
        res.json(result.rows);
    }catch(err){
        res.status(500).json ({ error: "Error al obtener las reseñas"});
    }
};

const createReview = async (req,res) => {
    try{
       const { id_product, calification, comment } = req.body;
        const result = await pool.query ("INSERT INTO reviews (id_user, id_product, calification, comment) VALUES ($1,$2,$3,$4) RETURNING *",
        [req.user.id, id_product, calification, comment]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: "Error al crear la reseña"});

    }
};

const deleteReview = async (req,res) => {
    try{
        const {id} = req.params;
        const result = await pool.query ("DELETE FROM reviews WHERE id_review = $1 and id_user = $2 RETURNING *", [id,req.user.id]);

        if (result.rows.length === 0) {
        return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando reseña" });
     console.log(err);
  }
};

module.exports = {
    getReviews,
    createReview,
    deleteReview
};
