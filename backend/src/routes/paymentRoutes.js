const express = require("express");
const router = express.Router();

const { authMiddleware,adminMiddleware } = require("../middleware/authMiddleware");
const {
    createPaymentOrder,
    verifyPayment,
    // paymentWebhook
    getUserPayments,
    getPaymentDetails,
    getAllPayments
} = require("../controllers/paymentController");

router.post("/create-order", authMiddleware, createPaymentOrder);

router.post("/verify", authMiddleware, verifyPayment);

// router.post("/webhook",  paymentWebhook);

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllPayments
);


router.get("/", authMiddleware, getUserPayments);

router.get("/:id", authMiddleware, getPaymentDetails);


module.exports = router;