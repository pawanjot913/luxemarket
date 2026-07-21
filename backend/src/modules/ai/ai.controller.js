const { processShoppingAssistantQuery } = require("./ai.service");

const handleShoppingAssistant = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid non-empty message string is required.",
      });
    }

    const result = await processShoppingAssistantQuery(message.trim());

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleShoppingAssistant,
};
