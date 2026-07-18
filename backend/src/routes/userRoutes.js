const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, userController.getMyProfile);

router.put("/me", authMiddleware, userController.updateProfile);

router.put(
    "/change-password",
    authMiddleware,
    userController.changePassword
);

router.get(
    "/addresses",
    authMiddleware,
    userController.getAddresses
);

router.post(
    "/addresses",
    authMiddleware,
    userController.addAddress
);

router.put(
    "/addresses/:addressId",
    authMiddleware,
    userController.updateAddress
);

router.delete(
    "/addresses/:addressId",
    authMiddleware,
    userController.deleteAddress
);

router.patch(
    "/addresses/:addressId/default",
    authMiddleware,
    userController.setDefaultAddress
);

module.exports = router;