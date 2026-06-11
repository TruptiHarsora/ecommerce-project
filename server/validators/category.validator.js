const Joi = require("joi");

exports.createCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    parent: Joi.string().hex().length(24).allow(null, "").optional(),
    isActive: Joi.boolean().optional()
});

exports.updateCategorySchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    parent: Joi.string().hex().length(24).allow(null, "").optional(),
    isActive: Joi.boolean().optional()
});