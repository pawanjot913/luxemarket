const Coupon = require("../../models/Coupon");

const calculateDiscount = async (cartTotal, couponId, session = null) => {

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

    // Minimum order amount
    if (cartTotal < coupon.minOrderAmount) {
        throw new Error(
            `Minimum order amount is ₹${coupon.minOrderAmount}`
        );
    }

    let discount = 0;

    switch (coupon.discountType) {

        case "percentage":

            discount =
                (cartTotal * coupon.discountValue) / 100;

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

    discount = Math.min(discount, cartTotal);

    discount = Math.round(discount);

    const finalAmount = Math.round(cartTotal - discount);

    return {
        coupon,
        discount,
        finalAmount
    };

};

module.exports = calculateDiscount;