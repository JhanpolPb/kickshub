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
        const result = await pool.query("SELECT password FROM users WHERE id= $1", 
            [req.user.id]);
        const user = result.rows[0];

        
        const validPassword = await bcrypt.compare(currentPassword, user.password);
         if (!validPassword){
            return res.status(400).json({ error: "Contraseña actual incorrecta"});
        }

        const hasedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password=$1 WHERE id=$2",[hasedPassword, req.user.id]);
        res.json({ message: "Contraseña actualizada correctamente"});

    }catch (err){
        res.status(500).json({ error: "Error cambiando contraseña"});

    }
};

const getAdress = async (req, res) => {
    try{
    const result = await pool.query("SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC", 
        [req.user.id]);
    res.json(result.rows);
    }catch(err){
    res.status(500).json ({ error: "Error obteniendo direcciones"});
    }
};

const addAddress = async (req, res) => {
    try{
    const { street, city, department, zip_code, is_default } = req.body;
    
    if (is_default) {
        await pool.query("UPDATE addresses SET is_default = false WHERE user_id = $1", 
            [req.user.id]);
    }

    const result = await pool.query(
        "INSERT INTO addresses (user_id, street, city, department, zip_code, is_default) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [req.user.id, street, city, department, zip_code, is_default]
    );
    res.status(201).json(result.rows[0]
    )
    }catch(err){
        res.status(500).json ({ error: "Error agregando direcciones"});
            detalle: err.message
    }
};

const deleteAddress = async (req, res) => {
    try{
    const {id} = req.params;
    await pool.query("DELETE FROM addresses WHERE id = $1 AND user_id = $2",[id,req.user.id]);
    res.json({ message: "Dirección eliminada correctamente"});

    }catch(err){
        res.status(500).json ({ error: "Error eliminando direccion"})
    }
};

module.exports = { getProfile, updateProfile, changePassword, getAdress, addAddress, deleteAddress };