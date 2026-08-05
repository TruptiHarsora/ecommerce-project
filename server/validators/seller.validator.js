const Joi = require("joi");

// const becomeSellerSchema = Joi.object({
//   shopName: Joi.string().min(2).max(80).required(),
//   gstNumber: Joi.string().allow("", null),
//   //  gstNumber: Joi.string()
//   //     .trim()
//   //     .allow("", null)
//   //     .pattern(/^[0-9A-Z]{0,15}$/)
//   //     .messages({
//   //         "string.pattern.base": "Invalid GST number format"
//   //     })
// });

const becomeSellerSchema = Joi.object({
  shopName: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "Shop name is required",
    "string.min": "Shop name must be at least 2 characters",
    "string.max": "Shop name cannot exceed 60 characters",
  }),

  gstNumber: Joi.string().trim().allow("", null).max(15).messages({
    "string.max": "GST number cannot exceed 15 characters",
  }),

  businessPhone: Joi.string()
    .trim()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.empty": "Business phone is required",
      "string.pattern.base": "Enter a valid 10-digit mobile number",
    }),

  pickupAddress: Joi.object({
    addressLine1: Joi.string().trim().required().messages({
      "string.empty": "Address is required",
    }),

    city: Joi.string().trim().required().messages({
      "string.empty": "City is required",
    }),

    state: Joi.string().trim().required().messages({
      "string.empty": "State is required",
    }),

    postalCode: Joi.string()
      .trim()
      .pattern(/^\d{6}$/)
      .required()
      .messages({
        "string.pattern.base": "Postal code must be 6 digits",
      }),
  }).required(),
});

const updateSellerProfileSchema = Joi.object({
  shopName: Joi.string().trim().min(2).max(80).required(),

  gstNumber: Joi.string().trim().allow("", null),

  businessPhone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .messages({
      "string.pattern.base": "Invalid business phone number",
    }),

  pickupAddress: Joi.object({
    addressLine1: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
  }),
}).min(1);
module.exports = { becomeSellerSchema, updateSellerProfileSchema };
