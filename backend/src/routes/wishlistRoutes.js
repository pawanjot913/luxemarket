const User = require("../models/User");


router.post(
    "/wishlist/:productId",
    authMiddleware,
    addToWishlist
);

router.get(
    "/wishlist",
    authMiddleware,
    getWishlist
);

router.delete(
    "/wishlist/:productId",
    authMiddleware,
    removeFromWishlist
);