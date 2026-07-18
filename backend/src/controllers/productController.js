const Product = require("../models/Product");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, image, gender, sizes, colors, rating, reviewsCount, details, isNew } = req.body;
        
        // Associate product with the seller if the user is a seller
        const sellerId = req.user.role === 'seller' ? req.user.id : undefined;

        const newProduct = await Product.create({
            name,
            description,    
            price,
            category,
            stock,
            image,
            gender,
            sizes,
            colors,
            rating,
            reviewsCount,
            details,
            isNew,
            seller: sellerId
        });
        
        res.status(201).json({
          message: "Product created successfully",
          product: newProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { search, category, gender } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        let query = {};

        if (search) {
          query.name = {
            $regex: search,
            $options: "i",
          };
        }

        if (category) {
          query.category = category.includes(",") ? { $in: category.split(",") } : category;
        }

        if (gender) {
          query.gender = gender;
        }

        // Row-Level Access Check: Filter products by seller if token is provided and role is seller
        const authHeader = req.headers.authorization;
        if (authHeader) {
          try {
            const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : authHeader.trim();
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.role === 'seller') {
              query.seller = decoded.id;
            }
          } catch (err) {
            // Ignore verification error for public catalog listing
          }
        }

        const products = await Product.find(query)
          .skip((page - 1) * limit)
          .limit(limit);

        res.status(200).json({
            message: "Products fetched successfully",
            products
        });
       
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({
            message: "Invalid product id",
          });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product fetched successfully",
            product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Row-level access control: check if seller owns this product
    if (req.user.role === 'seller' && (!product.seller || product.seller.toString() !== req.user.id)) {
      return res.status(403).json({
        message: "Forbidden: You do not own this product",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Row-level access control: check if seller owns this product
        if (req.user.role === 'seller' && (!product.seller || product.seller.toString() !== req.user.id)) {
          return res.status(403).json({
            message: "Forbidden: You do not own this product",
          });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted successfully",
            product: deletedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};