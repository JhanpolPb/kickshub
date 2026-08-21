const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  getProducts, getProductById, createProduct, updateProduct, deleteProduct
} = require("../controllers/productController");
const adminMiddleware = require("../middleware/adminMiddleware");
const authMiddleware  = require("../middleware/authMiddleware");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

const productRules = [
  body("name").trim().notEmpty().withMessage("El nombre es requerido")
    .isLength({ max: 150 }).withMessage("Nombre muy largo"),
  body("brand").trim().notEmpty().withMessage("La marca es requerida"),
  body("price").isFloat({ min: 0 }).withMessage("El precio debe ser un número positivo"),
  body("size").isFloat({ min: 0 }).withMessage("La talla debe ser un número positivo"),
  body("stock").isInt({ min: 0 }).withMessage("El stock debe ser un entero positivo"),
];

router.get("/",      getProducts);
router.get("/:id",   getProductById);
router.post("/",     authMiddleware, adminMiddleware, productRules, validate, createProduct);
router.put("/:id",   authMiddleware, adminMiddleware, productRules, validate, updateProduct);
router.delete("/:id",authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;
