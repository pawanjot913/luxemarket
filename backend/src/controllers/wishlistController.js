const User = require("../models/User");




const addToWishlist = async (req, res) => {
    try {

        const userId = req.user.id;
        const { productId } = req.params;

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    wishlist: productId
                }
            }
        );

        res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getWishlist = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .populate({
                path: "wishlist",
                select: "name price images stock"
            }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            wishlist: user.wishlist
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const removeFromWishlist = async (req, res) => {
    try {

        const { productId } = req.params;

       const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                $pull: {
                    wishlist: productId
                }
            },
            {
                new: true
            }
        );
        if (!user) {
    return res.status(404).json({
        success: false,
        message: "User not found"
    });
}
        res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};