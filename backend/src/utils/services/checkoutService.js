const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const calculateCartTotal = require("../helper/calculateCartTotal");
const calculateDiscount = require("../helper/calculateDiscount");

const checkoutService = async ({
    userId,
    cart,
    payment,
    paymentMethod,
    session
}) => {

    const paymentStatus =
        paymentMethod === "ONLINE"
            ? "paid"
            : "pending";

    const orderProducts = [];

    // Update stock using payment snapshot
    for (const item of payment.products) {

        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: item.productId,
                stock: {
                    $gte: item.quantity
                }
            },
            {
                $inc: {
                    stock: -item.quantity
                }
            },
            {
                new: true,
                session
            }
        );

      if (!updatedProduct) {
    const product = await Product.findById(item.productId)
        .select("name")
        .session(session);

    throw new Error(
        `${product?.name || "Product"} is out of stock`
    );
}

        orderProducts.push({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        });
    }

    const [order] = await Order.create(
        [
            {
                user: userId,

                products: orderProducts,

                cartTotal: payment.cartTotal,

                discount: payment.discount,

                totalAmount: payment.payableAmount,

                coupon: payment.coupon,

                payment: payment._id,

                paymentMethod,

                paymentStatus
            }
        ],
        {
            session
        }
    );

    // Clear cart after successful order
    cart.products = [];
    cart.coupon = null;
    cart.discount = 0;

    await cart.save({ session });

    return order;
};



module.exports = checkoutService;