const pool = require('../config/database.js');
const bcrypt = require('bcryptjs');

const getProfile= async (req, res) => {
    try{

        const result = await pool.query( "SELECT id, name, email, role, created_at FROM users WHERE id = $1", 
            [req.user.id]
        );
        res.json(result.rows[0]);
    }catch{

    }
}