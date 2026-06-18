const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const orderItemSchema = Joi.object({
  product: objectId.required(),
  seller: objectId.required(),
  variantSku: Joi.string().required(),
  variantImg: Joi.string(),
  quantity: Joi.number().integer().min(1).max(10).required()
});


const shippingAddressSchema = Joi.object({
  fullName: Joi.string().min(3).max(100).required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().allow("", null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().default("India")
});


const paymentInfoSchema = Joi.object({
  method: Joi.string().valid("cod", "online").default("cod"),

  status: Joi.string().valid(
    "created",
    "pending",
    "paid",
    "failed",
    "refunded"
  ).default("pending")
});


exports.createOrderValidator = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).max(20).required(),
  shippingAddress: shippingAddressSchema.required(),
  paymentInfo: paymentInfoSchema.optional()
});


exports.updateOrderStatusValidator = Joi.object({
  status: Joi.string().valid(
    "placed",
    "confirmed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled"
  ).required()
});