const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id;

        // Validate quantity
        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Find user's cart
        let cartItem = await Cart.findOne({ user: userId });

        // Create cart if it doesn't exist
        if (!cartItem) {
            cartItem = new Cart({
                user: userId,
                products: [
                    {
                        productId,
                        quantity
                    }
                ]
            });
        } else {
            // Check if product already exists in cart
            const existingProduct = cartItem.products.find(
                item => item.productId.toString() === productId
            );

            if (existingProduct) {
                existingProduct.quantity += Number(quantity);
            } else {
                cartItem.products.push({
                    productId,
                    quantity
                });
            }
        }

        await cartItem.save();

        res.status(200).json({
            message: "Product added to cart",
            cart: cartItem
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItem = await Cart.findOne({user: userId}).populate('products.productId');
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
        res.status(200).json({
            message: "Cart retrieved successfully",
            cart: cartItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }   
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;
        const cartItem = await Cart.findOne({ user: userId });
        if (!cartItem) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }
        const originalLength = cartItem.products.length;
        const updatedProducts = cartItem.products.filter(
            item=> item.productId.toString()!== productId
        );
        if (updatedProducts.length === originalLength) {
    return res.status(404).json({
        message: "Product not found in cart"
    });
}
        cartItem.products = updatedProducts;
        await cartItem.save();
        
        res.status(200).json({
            message: "Product removed from cart",
            cart: cartItem
        });
    } catch (error) {        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateCartItem = async (req, res) => {
    try{
        const { productId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        if(!quantity || quantity < 1){
            return res.status(400).json({
                message: "Quantity must be at least 1"
            });
        }

        const cartItem = await Cart.findOne({ user: userId });

        if(!cartItem){
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const productInCart = cartItem.products.find(
            item => item.productId.toString() === productId
        );

        if(!productInCart){
            return res.status(404).json({
                message: "Product not found in cart"
            });
        }
        productInCart.quantity = Number(quantity);
        await cartItem.save();

        res.status(200).json({
            message: "Cart item updated successfully",
            cart: cartItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });


        
    }
};
module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    updateCartItem
};
        
