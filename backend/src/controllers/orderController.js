const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const calculateCartTotal = require("../utils/helper/calculateCartTotal");
const calculateDiscount = require("../utils/helper/calculateDiscount");
const checkoutService = require("../utils/services/checkoutService");

const createOrder = async (req, res) => {

    if (req.body.paymentMethod !== "COD") {
        return res.status(400).json({
            success: false,
            message: "Online orders must be placed through the payment API."
        });
    }

    const session = await mongoose.startSession();

    try {

        session.startTransaction();
        const { cart, cartTotal } =
    await calculateCartTotal(req.user.id, session);

const {
    discount,
    finalAmount
} = await calculateDiscount(
    cartTotal,
    cart.coupon,
    session,
    cart
);

        const order = await checkoutService({
            userId: req.user.id,
    cart,
    cartTotal,
    discount,
    totalAmount: finalAmount,
    paymentMethod: "COD",
    coupon: cart.coupon,
    session
        });

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Order created successfully.",
            order
        });

    } catch (error) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        return res.status(400).json({
            success: false,
            message: error.message
        });

    } finally {

        await session.endSession();

    }

};
const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).select("totalAmount status createdAt");
        if (orders.length === 0) {
    return res.status(200).json({
        message: "No orders found",
        orders: []
    });
}
        res.status(200).json({
            message: "Orders retrieved successfully",
            orders
        });
       
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};


const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.orderId;
        const order = await Order.findOne({ _id: orderId , user: userId}).populate('products.productId');
        if (!order) {
            return res.status(404).json({   
                message: "Order not found"
            });
        }
        
        res.status(200).json({
            message: "Order retrieved successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        let filter = {};
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            const productIds = sellerProducts.map(p => p._id);
            filter["products.productId"] = { $in: productIds };
        }

        const orders = await Order.find(filter).populate('user', 'username email').sort({ createdAt: -1 });
        res.status(200).json({
            message: "All orders retrieved successfully",
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const orderId = req.params.orderId;
    const userId = req.user.id;

    // Get order first for validation and products
    const order = await Order.findOne({
      _id: orderId,
      user: userId,
    }).session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "cancelled") {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    if (
      order.status === "shipped" ||
      order.status === "delivered"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Cannot cancel shipped or delivered orders",
      });
    }

    // Atomic status update
    const updatedOrder = await Order.findOneAndUpdate(
      {
        _id: orderId,
        user: userId,
        status: { $in: ["pending", "paid"] },
      },
      {
        status: "cancelled",
      },
      {
        new: true,
        session,
      }
    );

    if (!updatedOrder) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Order could not be cancelled",
      });
    }

    // Restore stock
    for (const item of order.products) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: {
            stock: item.quantity,
          },
        },
        {
          session,
        }
      );
    }

    await session.commitTransaction();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order: updatedOrder,
    });

  } catch (error) {

    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  } finally {

    if (session) {
      await session.endSession();
    }

  }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        // Row-level access control for seller
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            const productIds = sellerProducts.map(p => p._id.toString());
            
            const hasSellerProduct = order.products.some(p => productIds.includes(p.productId.toString()));
            if (!hasSellerProduct) {
                return res.status(403).json({
                    message: "Forbidden: This order does not contain any of your products"
                });
            }
        }

        const allowedStatuses = [
            "pending",
            "shipped",
            "delivered"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        if (order.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot update status of a cancelled order"
            });
        }

        // Prevent same status update
        if (order.status === status) {
            return res.status(400).json({
                message: `Order is already ${status}`
            });
        }

        // Enforce order lifecycle
        if (
            order.status === "pending" &&
            status !== "shipped"
        ) {
            return res.status(400).json({
                message: "Pending orders can only be moved to shipped"
            });
        }

        if (
            order.status === "shipped" &&
            status !== "delivered"
        ) {
            return res.status(400).json({
                message: "Shipped orders can only be moved to delivered"
            });
        }

        if (order.status === "delivered") {
            return res.status(400).json({
                message: "Delivered orders cannot be updated"
            });
        }

        order.status = status;

        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const updateOrderPaymentStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { paymentStatus } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        if(order.status === "cancelled") {
            return res.status(400).json({
                message: "Cannot update payment status of a cancelled order"
            });
        }
        if (paymentStatus !== "paid") {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }
        if(order.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Order is already paid"
            });
        }
        if (
    order.paymentMethod === "COD" &&
    order.status !== "delivered"
) {
    return res.status(400).json({
        message: "COD orders can only be marked as paid after delivery"
    });
}
        order.paymentStatus = paymentStatus;
        await order.save();
        return res.status(200).json({
            message: "Order payment status updated successfully",
            order
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

const getDashboardStats = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        let pipeline = [];
        if (sellerProductIds) {
            pipeline = [
                { $match: { "products.productId": { $in: sellerProductIds } } },
                { $unwind: "$products" },
                { $match: { "products.productId": { $in: sellerProductIds } } },
                {
                    $group: {
                        _id: "$_id",
                        status: { $first: "$status" },
                        paymentStatus: { $first: "$paymentStatus" },
                        sellerOrderRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        pendingOrders: {
                            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
                        },
                        shippedOrders: {
                            $sum: { $cond: [{ $eq: ["$status", "shipped"] }, 1, 0] }
                        },
                        deliveredOrders: {
                            $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] }
                        },
                        cancelledOrders: {
                            $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] }
                        },
                        totalRevenue: {
                            $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, "$sellerOrderRevenue", 0] }
                        }
                    }
                }
            ];
        } else {
            pipeline = [
                {
                    $group: {
                        _id: null,
                        totalOrders: {
                            $sum: 1
                        },
                        pendingOrders: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "pending"] },
                                    1,
                                    0
                                ]
                            }
                        },
                        shippedOrders: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "shipped"] },
                                    1,
                                    0
                                ]
                            }
                        },
                        deliveredOrders: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "delivered"] },
                                    1,
                                    0
                                ]
                            }
                        },
                        cancelledOrders: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$status", "cancelled"] },
                                    1,
                                    0
                                ]
                            }
                        },
                        totalRevenue: {
                            $sum: {
                                $cond: [
                                    { $eq: ["$paymentStatus", "paid"] },
                                    "$totalAmount",
                                    0
                                ]
                            }
                        }
                    }
                }
            ];
        }

        const stats = await Order.aggregate(pipeline);

        if (stats.length === 0) {
            return res.status(200).json({
                totalOrders: 0,
                totalRevenue: 0,
                pendingOrders: 0,
                shippedOrders: 0,
                deliveredOrders: 0,
                cancelledOrders: 0
            });
        }

        return res.status(200).json({
            success: true,
            dashboard: stats[0]
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

const getTopSellingProducts = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        const pipeline = [
            { $unwind: "$products" }
        ];

        if (sellerProductIds) {
            pipeline.push({ $match: { "products.productId": { $in: sellerProductIds } } });
        }

        pipeline.push(
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true
            } },
            {
                $project: {
                    _id: 0,
                    productId: "$product._id",
                    name: "$product.name",
                    totalSold: 1
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        );

        const topProducts = await Order.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            topSellingProducts: topProducts
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
}

const getMonthlyRevenue = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        let pipeline = [];
        if (sellerProductIds) {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" },
                        "products.productId": { $in: sellerProductIds }
                    }
                },
                { $unwind: "$products" },
                { $match: { "products.productId": { $in: sellerProductIds } } },
                {
                    $group: {
                        _id: "$_id",
                        createdAt: { $first: "$createdAt" },
                        sellerOrderRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        revenue: {
                            $sum: "$sellerOrderRevenue"
                        },
                        orders: {
                            $sum: 1
                        }
                    }
                }
            ];
        } else {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        revenue: {
                            $sum: "$totalAmount"
                        },
                        orders: {
                            $sum: 1
                        }
                    }
                }
            ];
        }

        pipeline.push(
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    revenue: 1,
                    orders: 1
                }
            },
            {
                $sort: {
                    year: 1,
                    month: 1
                }
            }
        );

        const monthlyRevenue = await Order.aggregate(pipeline);

        res.status(200).json({
            success: true,
            monthlyRevenue
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrderStatusAnalytics = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        const pipeline = [];
        if (sellerProductIds) {
            pipeline.push({ $match: { "products.productId": { $in: sellerProductIds } } });
        }

        pipeline.push(
            {
                $group: {
                    _id: "$status",
                    totalOrders: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    status: "$_id",
                    totalOrders: 1
                }
            },
            {
                $sort: {
                    totalOrders: -1
                }
            }
        );

        const orderStatus = await Order.aggregate(pipeline);

        res.status(200).json({
            success: true,
            orderStatus
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTopCustomers = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        let pipeline = [];
        if (sellerProductIds) {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" },
                        "products.productId": { $in: sellerProductIds }
                    }
                },
                { $unwind: "$products" },
                { $match: { "products.productId": { $in: sellerProductIds } } },
                {
                    $group: {
                        _id: { orderId: "$_id", user: "$user" },
                        sellerOrderSpent: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                    }
                },
                {
                    $group: {
                        _id: "$_id.user",
                        orders: { $sum: 1 },
                        totalSpent: { $sum: "$sellerOrderSpent" }
                    }
                }
            ];
        } else {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" }
                    }
                },
                {
                    $group: {
                        _id: "$user",
                        orders: { $sum: 1 },
                        totalSpent: { $sum: "$totalAmount" }
                    }
                }
            ];
        }

        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    orders: 1,
                    totalSpent: 1
                }
            },
            {
                $sort: {
                    totalSpent: -1
                }
            },
            {
                $limit: 10
            }
        );

        const topCustomers = await Order.aggregate(pipeline);

        res.status(200).json({
            success: true,
            topCustomers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLowStockProducts = async (req, res) => {
    try {
        const threshold = Number(req.query.threshold) || 10;
        let matchStage = { stock: { $lte: threshold } };
        
        if (req.user && req.user.role === 'seller') {
            matchStage.seller = new mongoose.Types.ObjectId(req.user.id);
        }

        const lowStockProducts = await Product.aggregate([
            {
                $match: matchStage
            },
            {
                $project: {
                    name: 1,
                    stock: 1,
                    price: 1
                }
            },
            {
                $sort: {
                    stock: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            lowStockProducts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getTopCategories = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        let pipeline = [
            {
                $match: {
                    paymentStatus: "paid",
                    status: { $ne: "cancelled" }
                }
            }
        ];

        if (sellerProductIds) {
            pipeline[0].$match["products.productId"] = { $in: sellerProductIds };
        }

        pipeline.push({ $unwind: "$products" });

        if (sellerProductIds) {
            pipeline.push({ $match: { "products.productId": { $in: sellerProductIds } } });
        }

        pipeline.push(
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.category",
                    totalSold: {
                        $sum: "$products.quantity"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalSold: 1
                }
            },
            {
                $sort: {
                    totalSold: -1
                }
            }
        );

        const topCategories = await Order.aggregate(pipeline);

        res.status(200).json({
            success: true,
            topCategories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAverageOrderValue = async (req, res) => {
    try {
        let sellerProductIds = null;
        if (req.user && req.user.role === 'seller') {
            const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
            sellerProductIds = sellerProducts.map(p => p._id);
        }

        let pipeline = [];
        if (sellerProductIds) {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" },
                        "products.productId": { $in: sellerProductIds }
                    }
                },
                { $unwind: "$products" },
                { $match: { "products.productId": { $in: sellerProductIds } } },
                {
                    $group: {
                        _id: "$_id",
                        sellerOrderRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageOrderValue: {
                            $avg: "$sellerOrderRevenue"
                        },
                        totalRevenue: {
                            $sum: "$sellerOrderRevenue"
                        },
                        totalOrders: {
                            $sum: 1
                        }
                    }
                }
            ];
        } else {
            pipeline = [
                {
                    $match: {
                        paymentStatus: "paid",
                        status: { $ne: "cancelled" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        averageOrderValue: {
                            $avg: "$totalAmount"
                        },
                        totalRevenue: {
                            $sum: "$totalAmount"
                        },
                        totalOrders: {
                            $sum: 1
                        }
                    }
                }
            ];
        }

        pipeline.push(
            {
                $project: {
                    _id: 0,
                    averageOrderValue: {
                        $round: ["$averageOrderValue", 2]
                    },
                    totalRevenue: 1,
                    totalOrders: 1
                }
            }
        );

        const result = await Order.aggregate(pipeline);

        res.status(200).json({
            success: true,
            analytics: result[0] || {
                averageOrderValue: 0,
                totalRevenue: 0,
                totalOrders: 0
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    updateOrderPaymentStatus,
    getTopSellingProducts,
    getMonthlyRevenue,
    getDashboardStats,
    getOrderStatusAnalytics,
    getTopCustomers,
    getLowStockProducts,
    getTopCategories,
    getAverageOrderValue
};
