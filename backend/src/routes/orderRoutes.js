const router = require('express').Router();
const { authMiddleware, adminMiddleware, adminOrSellerMiddleware } = require('../middleware/authMiddleware');
const { createOrder, getOrders, getAllOrders,getOrderById,updateOrderStatus,cancelOrder, updateOrderPaymentStatus, getDashboardStats, getTopSellingProducts, getMonthlyRevenue, getOrderStatusAnalytics, getTopCustomers, getLowStockProducts, getTopCategories, getAverageOrderValue } = require('../controllers/orderController');

router.post('/', authMiddleware, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/admin/orders', authMiddleware, adminOrSellerMiddleware, getAllOrders);
router.get('/:orderId', authMiddleware, getOrderById);
router.patch('/:orderId/status', authMiddleware, adminOrSellerMiddleware, updateOrderStatus);
router.patch(
  "/:orderId/cancel",
  authMiddleware,
  cancelOrder
);
router.patch('/:orderId/payment-status', authMiddleware, adminOrSellerMiddleware, updateOrderPaymentStatus);


router.get(
    "/admin/dashboard",
    authMiddleware,
    adminOrSellerMiddleware,
    getDashboardStats
);

router.get(
    "/admin/top-products",
    authMiddleware,
    adminOrSellerMiddleware,
    getTopSellingProducts
);
router.get(
    "/admin/monthly-revenue",
    authMiddleware,
    adminOrSellerMiddleware,
    getMonthlyRevenue
);
router.get(
    "/admin/order-status",
    authMiddleware,
    adminOrSellerMiddleware,
    getOrderStatusAnalytics
);
router.get(
    "/admin/top-customers",
    authMiddleware,
    adminOrSellerMiddleware,
    getTopCustomers
);

router.get(
    "/admin/low-stock",
    authMiddleware,
    adminOrSellerMiddleware,
    getLowStockProducts
);
router.get(
    "/admin/top-categories",
    authMiddleware,
    adminOrSellerMiddleware,
    getTopCategories
);
router.get(
    "/admin/aov",
    authMiddleware,
    adminOrSellerMiddleware,
    getAverageOrderValue
);

module.exports = router;
