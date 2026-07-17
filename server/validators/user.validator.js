const joi = require("joi");

const addressSchema = joi.object({
    fullName: joi.string().trim().min(3).max(100).required(),
    phone: joi.string().pattern(/^[6-9]{10}$/).required(),
    addressLine1: joi.string().required(),
    addressLine2: joi.string().allow("", null),
    city: joi.string().required(),
    state: joi.string().required(),
    postalCode: joi.string().required(),
    country: joi.string().default('India'),
    isDefault: joi.boolean().default(false)
});

const sellerProfileSchema = joi.object({
    shopName: joi.string().trim().min(2).max(100).required(),
    gstNumber: joi.string().pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).message("Invalid GST number"),
    isVerified: joi.boolean().default(false)
});

const registerSchema = joi.object({
    name: joi.string().trim().min(3).max(50).required(),
    email: joi.string().email().lowercase().trim().required(),
    password: joi.string()
        .min(6).max(128)
        .pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
        .message("Password must contain at least 1 upppercase and 1 number")
        .required(),
    role: joi.string().valid("user", "seller", "admin"),
    phone: joi.string().pattern(/^[0-9]{10}$/),
    addresses: joi.array().items(addressSchema).optional(),
    sellerProfile: joi.when("role", {
        is: "seller",
        then: sellerProfileSchema.required(),
        otherwise: joi.forbidden()
    }),
    // isVerified: joi.boolean(),
    // lastLogin: joi.date()
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

const updateRoleSchema = joi.object({
    role: joi
        .string()
        .valid("user", "seller", "admin")
        .required(),
});

const updateProfileSchema = joi.object({
    name: joi.string().trim().min(3).max(50),
    phone: joi.string().pattern(/^[6-9]\d{9}$/).message("Invalid phone number"),
    avatar: joi.string().uri().allow("", null)
}).min(1);

const changePasswordSchema = joi.object({
    currentPassword: joi.string().required(),
    newPassword: joi.string()
        .min(6)
        .max(128)
        .pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
        .message("Password must contain at least 1 uppercase letter and 1 number")
        .required(),
    confirmPassword: joi.any()
        .valid(joi.ref("newPassword"))
        .required()
        .messages({
            "any.only": "Confirm password does not match new password"
        })
});


module.exports = {
    registerSchema,
    loginSchema,
    addressSchema,
    sellerProfileSchema,
    updateProfileSchema,
    changePasswordSchema
};