const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({

    products: [
        {
            productId: {   
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1,
            },
        },

    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    default: null
},
discount: {
    type: Number,
    default: 0
}


}, { timestamps: true });

module.exports = mongoose.model("Cart", cartSchema);
