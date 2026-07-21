const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");


const createCoupon = async (req, res) => {
    try {

        const {
            code,
            discountType,
            discountValue,
            minOrderAmount = 0,
            maxDiscount,
            expiryDate
        } = req.body;

        if (!code || typeof code !== "string" || !code.trim()) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required."
            });
        }

        const normalizedCode = code.trim().toUpperCase();
        const parsedDiscountValue = Number(discountValue);
        const parsedMinOrderAmount = Number(minOrderAmount);
        const parsedMaxDiscount = maxDiscount != null ? Number(maxDiscount) : undefined;
        const expiry = new Date(expiryDate);

        if (!discountType || !["percentage", "fixed"].includes(discountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid discount type."
            });
        }

        if (Number.isNaN(parsedDiscountValue) || parsedDiscountValue <= 0) {
            return res.status(400).json({
                success: false,
                message: "Discount value must be a number greater than 0."
            });
        }

        if (discountType === "percentage" && parsedDiscountValue > 100) {
            return res.status(400).json({
                success: false,
                message: "Percentage discount cannot exceed 100."
            });
        }

        if (Number.isNaN(parsedMinOrderAmount) || parsedMinOrderAmount < 0) {
            return res.status(400).json({
                success: false,
                message: "Minimum order amount must be 0 or greater."
            });
        }

        if (parsedMaxDiscount != null && (Number.isNaN(parsedMaxDiscount) || parsedMaxDiscount < 0)) {
            return res.status(400).json({
                success: false,
                message: "Maximum discount must be 0 or greater."
            });
        }

        if (isNaN(expiry.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid expiry date."
            });
        }

        if (expiry <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Expiry date must be in the future."
            });
        }

        const existingCoupon = await Coupon.findOne({
            code: normalizedCode
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists."
            });
        }

        const sellerId = req.user.role === 'seller' ? req.user.id : (req.body.seller || null);

        const coupon = await Coupon.create({
            code: normalizedCode,
            discountType,
            discountValue: parsedDiscountValue,
            minOrderAmount: parsedMinOrderAmount,
            maxDiscount: parsedMaxDiscount,
            expiryDate: expiry,
            seller: sellerId
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully.",
            coupon: {
                _id: coupon._id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minOrderAmount: coupon.minOrderAmount,
                maxDiscount: coupon.maxDiscount,
                expiryDate: coupon.expiryDate,
                isActive: coupon.isActive
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getCoupons = async (req, res) => {
    try {

        let { page = 1, limit = 10, status = "all" } = req.query;

       page = Math.max(1, Number(page));
        limit = Math.min(100, Math.max(1, Number(limit)));

        const filter = {};

        if (req.user.role === 'seller') {
            filter.seller = req.user.id;
        }

        if (status === "active") {
            filter.isActive = true;
            filter.expiryDate = { $gt: new Date() };
        }

        if (status === "expired") {
            filter.expiryDate = { $lte: new Date() };
        }

        const [totalCoupons, coupons] = await Promise.all([
    Coupon.countDocuments(filter),
    Coupon.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
]);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalCoupons / limit),
            totalCoupons,
            coupons
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCouponById = async (req, res) => {
    try {

        const { couponId } = req.params;

        // Validate ObjectId
       

        const coupon = await Coupon.findById(couponId).select(
        "code discountType discountValue minOrderAmount maxDiscount expiryDate isActive seller createdAt"
    ).lean();

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found."
            });
        }

        if (req.user.role === 'seller' && (!coupon.seller || coupon.seller.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only view your own coupons."
            });
        }

        return res.status(200).json({
            success: true,
            coupon
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


const updateCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;

        const coupon = await Coupon.findById(couponId);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found."
            });
        }

        if (req.user.role === 'seller' && (!coupon.seller || coupon.seller.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only update your own coupons."
            });
        }

        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscount,
            expiryDate,
            isActive
        } = req.body;

        // ==========================
        // Duplicate coupon code check
        // ==========================
        if (code !== undefined) {

            const normalizedCode = code.trim().toUpperCase();

            if (normalizedCode !== coupon.code) {

                const existingCoupon = await Coupon.findOne({
                    code: normalizedCode
                });

                if (existingCoupon) {
                    return res.status(400).json({
                        success: false,
                        message: "Coupon code already exists."
                    });
                }

                coupon.code = normalizedCode;
            }
        }

        // ==========================
        // Validate final discount values
        // ==========================

        const finalDiscountType =
            discountType ?? coupon.discountType;

        const finalDiscountValue =
            discountValue ?? coupon.discountValue;

        if (
            finalDiscountType === "percentage" &&
            finalDiscountValue > 100
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Percentage discount cannot exceed 100."
            });
        }

        // ==========================
        // Expiry Validation
        // ==========================

        if (expiryDate !== undefined) {

            const expiry = new Date(expiryDate);

            if (isNaN(expiry.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid expiry date."
                });
            }

            if (expiry <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Expiry date must be in the future."
                });
            }

            coupon.expiryDate = expiry;
        }

        // ==========================
        // Build update object
        // ==========================

        const updates = {};

        if (discountType !== undefined)
            updates.discountType = discountType;

        if (discountValue !== undefined)
            updates.discountValue = discountValue;

        if (minOrderAmount !== undefined)
            updates.minOrderAmount = minOrderAmount;

        if (maxDiscount !== undefined)
            updates.maxDiscount = maxDiscount;

        if (isActive !== undefined)
            updates.isActive = isActive;

        Object.assign(coupon, updates);

        // ==========================
        // Save
        // ==========================

        try {

            await coupon.save();

        } catch (error) {

            if (error.code === 11000) {
                return res.status(400).json({
                    success: false,
                    message: "Coupon code already exists."
                });
            }

            throw error;
        }

        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully.",
            coupon
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const toggleCouponStatus = async (req, res) => {
    try {

        const coupon = await Coupon.findById(req.params.couponId);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found."
            });
        }

        if (req.user.role === 'seller' && (!coupon.seller || coupon.seller.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only modify your own coupons."
            });
        }

        coupon.isActive = !coupon.isActive;

        await coupon.save();

        return res.status(200).json({
            success: true,
            message: `Coupon ${
                coupon.isActive ? "activated" : "deactivated"
            } successfully.`,
            coupon
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const applyCoupon = async (req, res) => {
    try {

        let { code } = req.body;

        // Validate request
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required."
            });
        }

        // Normalize coupon code
        code = code.trim().toUpperCase();

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("products.productId");

        // Check cart
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty."
            });
        }

        // Calculate cart total
        let cartTotal = 0;

        for (const item of cart.products) {

            // Skip deleted products
            if (!item.productId) {
                continue;
            }

            cartTotal += item.productId.price * item.quantity;
        }

        // Find coupon
        const coupon = await Coupon.findOne({
            code
        }).lean();

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon."
            });
        }

        // Check if coupon is active
        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Coupon is inactive."
            });
        }

        // Check expiry
        if (coupon.expiryDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired."
            });
        }

        // Calculate eligible total for seller coupon vs global coupon
        let eligibleTotal = 0;
        if (coupon.seller) {
            for (const item of cart.products) {
                if (!item.productId) continue;
                if (item.productId.seller && item.productId.seller.toString() === coupon.seller.toString()) {
                    eligibleTotal += item.productId.price * item.quantity;
                }
            }
            if (eligibleTotal === 0) {
                return res.status(400).json({
                    success: false,
                    message: "This coupon is not applicable to any products in your cart."
                });
            }
        } else {
            eligibleTotal = cartTotal;
        }

        // Minimum order validation
        if (eligibleTotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount for eligible products should be ₹${coupon.minOrderAmount}.`
            });
        }

        let discount = 0;

        switch (coupon.discountType) {

            case "percentage":

                discount =
                    (eligibleTotal * coupon.discountValue) / 100;

                if (coupon.maxDiscount) {
                    discount = Math.min(
                        discount,
                        coupon.maxDiscount
                    );
                }

                break;

            case "fixed":

                discount = coupon.discountValue;

                break;

            default:

                return res.status(400).json({
                    success: false,
                    message: "Invalid coupon type."
                });
        }

        // Discount cannot exceed eligible total
        discount = Math.min(discount, eligibleTotal);

        // Round values
        discount = Math.round(discount * 100) / 100;

        const finalAmount =
            Math.round((cartTotal - discount) * 100) / 100;

        // Save applied coupon in cart
cart.coupon = coupon._id;
cart.discount = discount;

await cart.save();

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully.",
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue
            },
            cartTotal,
            discount,
            finalAmount
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const removeCoupon = async (req, res) => {
    try {

        // Find user's cart
        const cart = await Cart.findOne({
            user: req.user.id
        });

        // Check if cart exists
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        // Check if coupon is applied
        if (!cart.coupon) {
            return res.status(400).json({
                success: false,
                message: "No coupon is applied to this cart."
            });
        }

        // Remove coupon
        cart.coupon = null;
        cart.discount = 0;

        await cart.save();

      return res.status(200).json({
    success: true,
    message: "Coupon removed successfully.",
    coupon: null,
    discount: 0
});

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};



const deleteCoupon = async (req, res) => {
    try {
        const { couponId } = req.params;
        const coupon = await Coupon.findById(couponId);
        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found."
            });
        }
        if (req.user.role === 'seller' && (!coupon.seller || coupon.seller.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Access denied: You can only delete your own coupons."
            });
        }
        await Coupon.findByIdAndDelete(couponId);
        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    toggleCouponStatus,
    applyCoupon,
    removeCoupon,
    deleteCoupon
};


