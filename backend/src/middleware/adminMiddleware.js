const adminMiddleware = (req,res,next) => {
    if(req.user.role != "admin"){
        return res.json(403).json({ error: "Acceso denegado - Se requiere rol de admin"})
    }
    next();
};

module.exports = adminMiddleware;
