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