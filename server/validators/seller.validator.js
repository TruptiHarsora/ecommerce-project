const Joi = require("joi");

const becomeSellerSchema = Joi.object({
    shopName: Joi.string().min(2).max(80).required(),
    gstNumber: Joi.string().allow("", null)
    //  gstNumber: Joi.string()
    //     .trim()
    //     .allow("", null)
    //     .pattern(/^[0-9A-Z]{0,15}$/)
    //     .messages({
    //         "string.pattern.base": "Invalid GST number format"
    //     })

});

module.exports = { becomeSellerSchema };