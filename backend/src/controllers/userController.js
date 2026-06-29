const pool = require('../config/database.js');
const bcrypt = require('bcryptjs');

const getProfile= async (req, res) => {
    try{

        const result = await pool.query( "SELECT id, name, email, role, created_at FROM users WHERE id = $1", 
            [req.user.id]
        );
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: "Error obteniendo perfil"});
    }
};

const updateProfile = async (req, res) => {
    try{

    }catch (err){
        res.status(500).json({ error: "Error actualizando perfil"});
    }
};