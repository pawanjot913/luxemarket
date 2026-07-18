const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const mongoose = require("mongoose");

const addReview = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { productId, rating, comment } = req.body;
        const userId = req.user.id;

        // 1. Check product exists
        const product = await Product.findById(productId).session(session);

        if (!product) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 2. Check if user already reviewed
        const existingReview = await Review.findOne({
            product: productId,
            user: userId
        }).session(session);

        if (existingReview) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        // 3. Check if user purchased product
        const purchased = await Order.findOne({
            user: userId,
            paymentStatus: "paid",
            status: "delivered",
            "products.productId": productId
        }).session(session);

        if (!purchased) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: "Purchase product before reviewing."
            });
        }

        // 4. Create review
        await Review.create([{
            product: productId,
            user: userId,
            rating,
            comment
        }], { session });

        // 5. Recalculate ratings
        const stats = await Review.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 }
                }
            }
        ]).session(session);

        await Product.findByIdAndUpdate(
            productId,
            {
                rating: stats[0].averageRating,
                reviewsCount: stats[0].numReviews
            },
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            message: "Review added successfully"
        });

    } catch (error) {

        await session.abortTransaction();

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        session.endSession();
    }
};

const updateReview = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { reviewId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // 1. Find review
        const review = await Review.findById(reviewId).session(session);

        if (!review) {
            await session.abortTransaction();
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // 2. Check ownership
        if (review.user.toString() !== userId) {
            await session.abortTransaction();
            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        // 3. Update review
        review.rating = rating;
        review.comment = comment;

        await review.save({ session });

        // 4. Recalculate product rating
        const stats = await Review.aggregate([
            {
                $match: {
                    product: review.product
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 }
                }
            }
        ]).session(session);

        // 5. Update product
        await Product.findByIdAndUpdate(
            review.product,
            {
                rating: stats[0].averageRating,
                reviewsCount: stats[0].numReviews
            },
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Review updated successfully"
        });

    } catch (error) {
        await session.abortTransaction();

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {
        session.endSession();
    }
};
const deleteReview = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const { reviewId } = req.params;
        const userId = req.user.id;

        // 1. Find review
        const review = await Review.findById(reviewId).session(session);

        if (!review) {
            await session.abortTransaction();

            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        // 2. Check ownership
        if (review.user.toString() !== userId) {
            await session.abortTransaction();

            return res.status(403).json({
                success: false,
                message: "Not authorized"
            });
        }

        const productId = review.product;

        // 3. Delete review
        await Review.findByIdAndDelete(reviewId).session(session);

        // 4. Calculate new rating
        const stats = await Review.aggregate([
            {
                $match: {
                    product: productId
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    numReviews: { $sum: 1 }
                }
            }
        ]).session(session);

        // 5. Update product
        if (stats.length === 0) {
            await Product.findByIdAndUpdate(
                productId,
                {
                    rating: 0,
                    reviewsCount: 0
                },
                { session }
            );
        } else {
            await Product.findByIdAndUpdate(
                productId,
                {
                    rating: stats[0].averageRating,
                    reviewsCount: stats[0].numReviews
                },
                { session }
            );
        }

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });

    } catch (error) {

        await session.abortTransaction();

        res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        session.endSession();

    }
};
const getProductReviews = async (req, res) => {
    try {

        const { productId } = req.params;

        // 1. Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // 2. Get reviews
        const page = Number(req.query.page) || 1;
const limit = Number(req.query.limit) || 10;

const skip = (page - 1) * limit;
      const reviews = await Review.find({
    product: productId
})
.populate("user", "name")
.sort({ createdAt: -1 })
.skip(skip)
.limit(limit);

        // Calculate actual stats from Review collection to override stale seed values
        const actualCount = await Review.countDocuments({ product: productId });
        const stats = await Review.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(productId)
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);
        const actualRating = stats.length > 0 ? stats[0].averageRating : 0;

        res.status(200).json({
            success: true,
            averageRating: actualRating,
            numReviews: actualCount,
            reviews
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    addReview,
    updateReview,
    deleteReview,
    getProductReviews
};