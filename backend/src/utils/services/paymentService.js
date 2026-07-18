const Cart = require("../../models/Cart");
const Payment = require("../../models/paymentModel");
const checkoutService = require("./checkoutService");

const verifyAndCompletePayment = async ({
    payment,
    userId,
    paymentId,
    gateway,
    session
}) => {

    const cart = await Cart.findOne({
        user: userId
    }).session(session);

    if (!cart) {
        throw new Error("Cart not found.");
    }

    const order = await checkoutService({
        userId,
        cart,
        payment,
        paymentMethod: "ONLINE",
        session
    });

    await Payment.findByIdAndUpdate(
        payment._id,
        {
            status: "SUCCESS",
            paymentId,
            gateway
        },
        { session }
    );

    return order;
};

module.exports = {
    verifyAndCompletePayment
};