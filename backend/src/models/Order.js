const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
{
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true,
                min: 0
            }
        }
    ],

    // Original cart total
    cartTotal: {
        type: Number,
        required: true
    },

    // Discount applied
    discount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    coupon: {
        type: Schema.Types.ObjectId,
        ref: "Coupon",
        default: null
    },

    payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        default: null
    },

    status: {
        type: String,
        enum: [
            "pending",
            "shipped",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid"
        ],
        default: "pending"
    },

    paymentMethod: {
        type: String,
        enum: [
            "COD",
            "ONLINE"
        ],
        required: true
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);