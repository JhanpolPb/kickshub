const pool = require('../config/datbase');

const getReviews = async (req,res) => {
    try{
        const result = await pool.query ("SELECT * FROM reviews WHERE id_product = $1", [req.params.id_product]);
        res.json(result.rows);
    }catch(err){
        res.status(500).json ({ error: "Error al obtener las reseñas"});
    }
};

const createReview = async (req,res) => {
    try{
        const { id_product, rating, comment } = req.body;
        const result = await pool.query ("INSERR INTO reviews (id_user, id_product, rating, comment) VALUES ($1,$2,$3,$4) RETURNING *",
        [req.user.id, id_product, rating, comment]);
        res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: "Error al crear la reseña"});

    }
};

const deleteReview = async (req,res) => {
    try{
        const {id} = req.params.id;
        const result = await pool.query ("DELETE FROM reviews WHERE id_user = $1 and id_product = $2 RETURNING *",)

        if (result.rows.length === 0) {
        return res.status(404).json({ error: "Reseña no encontrada" });
    }
    res.json({ message: "Reseña eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando reseña" });
  }
};
