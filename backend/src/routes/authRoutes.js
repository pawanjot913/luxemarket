const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

const { register, login } = require("../controllers/authController");
const { validate, loginSchema, registerSchema } = require("../middleware/user.validation");


router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route",
    user: req.user,
  });
});

module.exports = router;