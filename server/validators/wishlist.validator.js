const Joi = require("joi");

const addWishlistSchema = Joi.object({
    product: Joi.string().hex().length(24).required(),
    variantSku: Joi.string().required()
});


const toggleWishlistValidator = Joi.object({
  product: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.base": "Product must be a string",
      "string.length": "Invalid productId",
      "any.required": "Product is required"
    }),

  // OPTIONAL: variant SKU (some products may not need it)
  variantSku: Joi.string()
    .min(1)
    .max(100)
    .optional()
});


const moveToCartValidator = Joi.object({
  productId: Joi.string()
    .hex()
    .length(24)
    .required()
    .messages({
      "string.base": "productId must be a string",
      "string.length": "Invalid productId",
      "any.required": "productId is required"
    }),

  variantSku: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "any.required": "variantSku is required"
    })
});


module.exports = {
  toggleWishlistValidator,
  moveToCartValidator,addWishlistSchema
};