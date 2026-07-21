const express = require("express");
const router = express.Router();
const validateObjectId = require("../middleware/validateObjectId");

const {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    toggleCouponStatus,
    applyCoupon,
    removeCoupon,
    deleteCoupon
} = require("../controllers/couponController");

const { authMiddleware, adminOrSellerMiddleware } = require("../middleware/authMiddleware");

router.post("/admin/coupons", authMiddleware, adminOrSellerMiddleware, createCoupon);
router.get("/admin/coupons", authMiddleware, adminOrSellerMiddleware, getCoupons);
router.get(
    "/admin/coupons/:couponId",
    authMiddleware,
    adminOrSellerMiddleware,
    validateObjectId("couponId"),
    getCouponById
);
router.put(
    "/admin/coupons/:couponId",
    authMiddleware,
    adminOrSellerMiddleware,
    validateObjectId("couponId"),
    updateCoupon
);
router.delete(
    "/admin/coupons/:couponId",
    authMiddleware,
    adminOrSellerMiddleware,
    validateObjectId("couponId"),
    deleteCoupon
);
router.patch(
    "/admin/coupons/:couponId/toggle-status",
    authMiddleware,
    adminOrSellerMiddleware,
    validateObjectId("couponId"),
    toggleCouponStatus
);
router.post(
    "/coupons/apply",
    authMiddleware,
    applyCoupon
);
router.delete(
    "/coupons/remove",
    authMiddleware,
    removeCoupon
);
module.exports = router;