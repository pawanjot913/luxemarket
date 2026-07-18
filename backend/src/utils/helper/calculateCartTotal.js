const Cart = require("../../models/Cart");

const calculateCartTotal = async (
    userId,
    session = null
) => {

    const cart = await Cart.findOne({ user: userId })
        .populate("products.productId").session(session);

    if (!cart) {
        throw new Error("Cart not found");
    }

    if (cart.products.length === 0) {
        throw new Error("Cart is empty");
    }

    let cartTotal = 0;

    for (const item of cart.products) {

       if (!item.productId) {
    throw new Error("One or more products are no longer available");
}
        cartTotal += item.productId.price * item.quantity;
    }

    return {
        cart,
        cartTotal
    };
};

module.exports = calculateCartTotal;