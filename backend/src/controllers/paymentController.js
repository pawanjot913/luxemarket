const { randomUUID } = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/paymentModel");
const calculateCartTotal = require("../utils/helper/calculateCartTotal");
const calculateDiscount = require("../utils/helper/calculateDiscount");
const checkoutService = require("../utils/services/checkoutService");
const Cart = require("../models/Cart");
const { verifyAndCompletePayment } = require("../utils/services/paymentService");
const createPaymentOrder = async (req, res) => {
    try {

        // Calculate cart total
        const { cart, cartTotal } =
            await calculateCartTotal(req.user.id);
        if (!cart || cart.products.length === 0) {
    return res.status(400).json({
        success: false,
        message: "Cart is empty."
    });
}
         const existingPayment = await Payment.findOne({
            user: req.user.id,
            status: "PENDING"
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending payment."
            });
        }

        // Revalidate coupon
        const { discount, finalAmount } =
            await calculateDiscount(
                cartTotal,
                cart.coupon,
                null,
                cart
            );

        // Generate unique payment order id
        const paymentOrderId = randomUUID();



            const products = cart.products.map(item => ({
    productId: item.productId._id,
    quantity: item.quantity,
    price: item.productId.price
}));

        // Create payment
        const payment = await Payment.create({
            user: req.user.id,
            paymentOrderId,
            payableAmount: finalAmount,
            status: "PENDING",
            products,
            cartTotal: cartTotal,
            discount: discount,
            coupon: cart.coupon
        });

       return res.status(201).json({
            success: true,
            message: "Payment order created successfully",
            payment: {
                paymentOrderId: payment.paymentOrderId,
                payableAmount: payment.payableAmount,
                currency: payment.currency,
                status: payment.status
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




const verifyPayment = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { paymentOrderId } = req.body;

        // Validate request
        if (!paymentOrderId) {
            return res.status(400).json({
                success: false,
                message: "Payment order id is required."
            });
        }

        // Find payment
        const payment = await Payment.findOneAndUpdate(
    {
        paymentOrderId,
        user: req.user.id,
        status: "PENDING"
    },
    {
        status: "PROCESSING"
    },
    {
        new: true
    }
);

       if (!payment) {
    const existing = await Payment.findOne({
        paymentOrderId,
        user: req.user.id
    });

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: "Payment not found."
        });
    }


        // Idempotency
        if (payment.status === "SUCCESS") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified."
            });
        }

        // Failed payment cannot be verified again
        if (payment.status === "FAILED") {
            return res.status(400).json({
                success: false,
                message: "Payment has already failed."
            });
        }
          if (existing.status === "PROCESSING") {
        return res.status(409).json({
            success: false,
            message: "Payment is already being processed."
        });
    }}

        /*
            MOCK PAYMENT VERIFICATION

            Later this will be replaced with
            Razorpay Signature Verification
        */
        const paymentVerified = true;

        if (!paymentVerified) {

            await Payment.findByIdAndUpdate(
                payment._id,
                {
                    status: "FAILED",
                    gateway: "MOCK"
                }
            );

            return res.status(400).json({
                success: false,
                message: "Payment verification failed."
            });
        }

        // Start Transaction
        session.startTransaction();

        // Complete payment
        const order = await verifyAndCompletePayment({
            payment,
    userId: req.user.id,
    session,
    paymentId: `MOCK_${Date.now()}`,
    gateway: "MOCK"
        });

        // Commit Transaction
        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully.",
            order
        });

    } catch (error) {

        await session.abortTransaction();

        return res.status(500).json({
            success: false,
            message: error.message
        });

    } finally {

        session.endSession();

    }
};

// const paymentWebhook = async (req, res) => {

//     const session = await mongoose.startSession();

//     try {

//         const {
//             secret,
//             paymentOrderId
//         } = req.body;

//         // Validate webhook secret
//         if (secret !== process.env.MOCK_WEBHOOK_SECRET) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid webhook secret."
//             });
//         }

//         // Atomic state transition
//         const payment = await Payment.findOneAndUpdate(
//             {
//                 paymentOrderId,
//                 status: "PENDING"
//             },
//             {
//                 status: "PROCESSING"
//             },
//             {
//                 new: true
//             }
//         );

//         if (!payment) {

//             const existingPayment = await Payment.findOne({
//                 paymentOrderId
//             });

//             if (!existingPayment) {
//                 return res.status(404).json({
//                     success: false,
//                     message: "Payment not found."
//                 });
//             }

//             if (existingPayment.status === "SUCCESS") {
//                 return res.status(200).json({
//                     success: true,
//                     message: "Payment already completed."
//                 });
//             }

//             if (existingPayment.status === "FAILED") {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Payment already failed."
//                 });
//             }

//             if (existingPayment.status === "PROCESSING") {
//                 return res.status(409).json({
//                     success: false,
//                     message: "Payment is already processing."
//                 });
//             }
//         }

//         session.startTransaction();

//         const order = await verifyAndCompletePayment({
//             payment,
//             userId: payment.user,
//             paymentId: `MOCK_${Date.now()}`,
//             gateway: "MOCK",
//             session
//         });

//         await session.commitTransaction();

//         return res.status(200).json({
//             success: true,
//             message: "Webhook processed successfully.",
//             order
//         });

//     } catch (error) {

//         await session.abortTransaction();

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     } finally {

//         session.endSession();

//     }

// };

const getUserPayments = async (req, res) => {
    try {

        const payments = await Payment.find({
            user: req.user.id
        })
            .select(
                "paymentOrderId payableAmount status gateway createdAt"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getPaymentDetails = async (req, res) => {
    try {

        const payment = await Payment.findOne({
            _id: req.params.id,
            user: req.user.id
        })
            .populate(
                "products.productId",
                "name images price"
            )
            .populate(
                "coupon",
                "code discountType discountValue"
            );

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found."
            });
        }

        return res.status(200).json({
            success: true,
            payment
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
const getAllPayments = async (req, res) => {
    try {

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.paymentOrderId) {
            filter.paymentOrderId = {
                $regex: req.query.paymentOrderId,
                $options: "i"
            };
        }

        const totalPayments = await Payment.countDocuments(filter);

        const payments = await Payment.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalPayments / limit),
            totalPayments,
            payments
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createPaymentOrder,
    verifyPayment,
    // paymentWebhook
    getUserPayments,
    getPaymentDetails,
    getAllPayments
};
