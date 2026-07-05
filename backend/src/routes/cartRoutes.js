const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require("../controllers/cartController");

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.put("/:id", authMiddleware, updateCart);
router.delete("/:id", authMiddleware, removeFromCart);
router.delete("/", authMiddleware, clearCart);

module.exports = router;