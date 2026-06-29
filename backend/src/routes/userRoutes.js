const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { getProfile, updateProfile, changePassword, getAdress } = require("../controllers/userController");

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.get("/addresses", authMiddleware, getAdress);
router.post("/addresses", authMiddleware, addAddress);
router.delete("/addresses/:id", authMiddleware, deleteAddress);

module.exports = router;