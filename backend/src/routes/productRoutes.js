const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware, adminOrSellerMiddleware } = require("../middleware/authMiddleware");


const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");

router.post("/", authMiddleware, adminOrSellerMiddleware, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", authMiddleware, adminOrSellerMiddleware, updateProduct);
router.delete("/:id", authMiddleware, adminOrSellerMiddleware, deleteProduct);

module.exports = router;