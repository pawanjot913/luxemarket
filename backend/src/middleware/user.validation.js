const Joi = require("joi");

exports.updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
});

exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

exports.addressSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow("").optional(),
  landmark: Joi.string().allow("").optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
  country: Joi.string().default("India"),
  addressType: Joi.string()
    .valid("Home", "Work", "Other")
    .default("Home"),
});

exports.loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required(),
});

exports.registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "seller", "admin").optional(),
});

exports.validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};