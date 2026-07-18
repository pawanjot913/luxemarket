const updateProductRating = async (productId, session) => {
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

    await Product.findByIdAndUpdate(
        productId,
        {
            averageRating: stats.length ? stats[0].averageRating : 0,
            numReviews: stats.length ? stats[0].numReviews : 0
        },
        { session }
    );
};