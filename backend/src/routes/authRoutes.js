const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { register, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Middleware que devuelve errores de validación si los hay
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty().withMessage("El nombre es requerido")
      .isLength({ min: 2, max: 50 }).withMessage("El nombre debe tener entre 2 y 50 caracteres"),
    body("email")
      .trim()
      .notEmpty().withMessage("El email es requerido")
      .isEmail().withMessage("Email inválido")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("La contraseña es requerida")
      .isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty().withMessage("El email es requerido")
      .isEmail().withMessage("Email inválido")
      .normalizeEmail(),
    body("password")
      .notEmpty().withMessage("La contraseña es requerida"),
  ],
  validate,
  login
);

router.get("/me", authMiddleware, getMe);

module.exports = router;
