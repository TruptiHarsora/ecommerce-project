const joi = require("joi");

const addressSchema = joi.object({
    fullName: joi.string().min(3).required(),
    phone: joi.string().pattern(/^[0-9]{10}$/).required(),
    addressLine1: joi.string().required(),
    addressLine2: joi.string().allow(""),
    city: joi.string().required(),
    state: joi.string().required(),
    postalCode: joi.string().required(),
    country: joi.string().default('India'),
    isDefault: joi.boolean()
});

const sellerProfileSchema = joi.object({
    shopName: joi.string().min(2).required(),
    gstNumber: joi.string().allow(""),
    isVerified: joi.boolean()
});

const registerSchema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string()
        .min(6)
        .pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
        .message("Password must contain at least 1 upppercase and 1 number")
        .required(),
    role: joi.string().valid("user", "seller", "admin"),
    phone: joi.string().pattern(/^[0-9]{10}$/),
    addresses: joi.array().items(addressSchema),
    sellerProfile: joi.when("role", {
        is: "seller",
        then: sellerProfileSchema.required(),
        otherwise: joi.forbidden()
    }),
    isVerified: joi.boolean(),
    lastLogin: joi.date()
})

module.exports = { registerSchema };