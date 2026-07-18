const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

const {register,login} = require("../controllers/authController");


router.post("/login", login);
router.post("/register", register);
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected Route",
    user: req.user,
  });
});

module.exports = router;