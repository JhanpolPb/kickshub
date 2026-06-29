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
        const { name, email } = req.body;
        const result = await pool.query(
            "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, role, created_at",
            [name, email, req.user.id]
        );
        res.json(result.rows[0]);

    }catch (err){
        res.status(500).json({ error: "Error actualizando perfil"});
    }
};

const changePassword = async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;
    }catch (err){

    }
};
