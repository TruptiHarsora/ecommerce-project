const Joi = require("joi");


const updateUserRoleSchema = Joi.object({
    role: Joi.string().valid("user", "seller", "admin").required()
});


const blockUserSchema = Joi.object({
    isBlocked: Joi.boolean().required()
});


const orderQuerySchema = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
    status: Joi.string().valid(
        "placed",
        "confirmed",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled"
    )
});

const mongoIdSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});

module.exports = { updateUserRoleSchema, blockUserSchema, orderQuerySchema, mongoIdSchema };