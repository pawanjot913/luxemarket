const Coupon = require("../../models/Coupon");

const calculateDiscount = async (cartTotal, couponId, session = null, cart = null) => {

    // No coupon applied
    if (!couponId) {
        return {
            coupon: null,
            discount: 0,
            finalAmount: cartTotal
        };
    }

    const coupon = await Coupon.findById(couponId).session(session);

    // Coupon deleted
    if (!coupon) {
        return {
            coupon: null,
            discount: 0,
            finalAmount: cartTotal
        };
    }

    // Coupon inactive
    if (!coupon.isActive) {
        throw new Error("Coupon is inactive");
    }

    // Coupon expired
    if (coupon.expiryDate < new Date()) {
        throw new Error("Coupon has expired");
    }

    let eligibleTotal = 0;
    if (coupon.seller && cart && cart.products) {
        for (const item of cart.products) {
            if (!item.productId) continue;
            if (item.productId.seller && item.productId.seller.toString() === coupon.seller.toString()) {
                eligibleTotal += item.productId.price * item.quantity;
            }
        }
        if (eligibleTotal === 0) {
            throw new Error("Coupon is not applicable to any products in your cart");
        }
    } else {
        eligibleTotal = cartTotal;
    }

    // Minimum order amount
    if (eligibleTotal < coupon.minOrderAmount) {
        throw new Error(
            `Minimum order amount for eligible products is ₹${coupon.minOrderAmount}`
        );
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

            throw new Error("Invalid coupon type");
    }

    discount = Math.min(discount, eligibleTotal);

    discount = Math.round(discount * 100) / 100;

    const finalAmount = Math.round((cartTotal - discount) * 100) / 100;

    return {
        coupon,
        discount,
        finalAmount
    };

};

module.exports = calculateDiscount;