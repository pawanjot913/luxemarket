const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentOrderId: {
        type: String,
        required: true,
        unique: true
    },

    paymentId: {
        type: String,
        default: null
    },

    payableAmount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    status: {
        type: String,
        enum: [
            "PENDING",
            "SUCCESS",
            "FAILED"
        ],
        default: "PENDING"
    },

    gateway: {
        type: String,
        default: "MOCK"
    },
    cartTotal: {
    type: Number,
    required: true
},
    discount: {
    type: Number,
    default: 0
},
    coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null
},
method: {
    type: String,
    default: null
},
failureReason: {
    type: String,
    default: null
},
products: [
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }
]
},
{
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);