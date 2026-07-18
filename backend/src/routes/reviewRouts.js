const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { addReview, getProductReviews, deleteReview } = require("../controllers/reviewController");







router.get(
    "/products/:productId/reviews",
    getProductReviews
);

router.post(
    "/products/:productId/reviews",
    authMiddleware,
    addReview
);
router.delete(
    "/products/:productId/reviews/:reviewId",
    authMiddleware,
    deleteReview
);

module.exports = router;

