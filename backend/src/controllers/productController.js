const pool = require("../config/database");

const getProducts = async (req,res) => {
    try{
        const result = await pool.query ("SELECT * FROM products ORDER BY created_at DESC");
        res.json(result.rows);
    }catch(err){
        res.status(500).json({ error: "Error obteniendo productos" });
    }
};

const getProductById = async (req,res) => {
    try{
        const [id] = req.params;
        
        const result = await pool.query ("SELECT * FROM products WHERE id = $1"[id]);
        if(resultados.row.lenght === 0){
            return res.status(404).json ({ error: "Producto no encontrado"})
        }
        res.json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error: "Error obteniendo productos" });
    }
};


const CreateProduct = async (req,res) => {
    try{
        const { name, brand, price, size, stock, image_url } = req.body;
        
        const result = await pool.query ("INSERT INTO products (name, brand, price, size, stock, image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *"
        [name, brand, price, size, stock, image_url]
    );
    res.status(201).json(result.rows[0]);
    }catch(err){
        res.status(500).json({ error:" Error creando el producto" })
    }
}; 

