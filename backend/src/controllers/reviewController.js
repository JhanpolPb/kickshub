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

    }catch(err){

    }
};