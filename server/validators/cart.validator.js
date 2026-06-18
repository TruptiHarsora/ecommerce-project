const Joi = require("joi");

const addToCartSchema = Joi.object({
    product: Joi.string().hex().length(24).required(),
    variantSku: Joi.string().min(1).max(100).required(),
    seller: Joi.string().required(),
    variantImg: Joi.string(),
    quantity: Joi.number().integer().min(1).max(10).default(1)
});

const updateCartSchema = Joi.object({
    quantity: Joi.number().integer().min(1).max(10).required()
});

const itemIdSchema = Joi.object({
    itemId: Joi.string().hex().length(24).required()
});

module.exports = { addToCartSchema, updateCartSchema, itemIdSchema };