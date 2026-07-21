const mongoose = require('mongoose');


const couponSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },

    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true
    },

    discountValue: {
        type: Number,
        required: true,
        min: 1
    },

    minOrderAmount: {
        type: Number,
        default: 0
    },

    maxDiscount: {
        type: Number
    },

    expiryDate: {
        type: Date,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);