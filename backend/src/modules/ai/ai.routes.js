const express = require("express");
const router = express.Router();
const { handleShoppingAssistant } = require("./ai.controller");

router.post("/shopping-assistant", handleShoppingAssistant);

module.exports = router;
