
const Joi = require("joi"); 

const reviewCreateSchema = Joi.object({
    rating: Joi.number()
        .min(1)
        .max(5)
        .required(),

    title: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    comment: Joi.string()
        .trim()
        .max(2000)
        .allow("", null),

    images: Joi.array()
        .items(Joi.string().uri())
        .max(5)
        .default([])
});


const reviewUpdateSchema = Joi.object({
    rating: Joi.number()
        .min(1)
        .max(5)
        .optional(),

    title: Joi.string()
        .trim()
        .max(100)
        .allow("", null)
        .optional(),

    comment: Joi.string()
        .trim()
        .max(2000)
        .allow("", null)
        .optional()
});


const helpfulSchema = Joi.object({
    vote: Joi.string()
        .valid("up")
        .default("up")
});

module.exports = {
    reviewCreateSchema,
    reviewUpdateSchema,
    helpfulSchema
};
    // const Joi = require("joi");
    // exports.reviewValidator = Joi.object({
    //     rating: Joi.number().min(1).max(5).required(),
    //     title: Joi.string().max(100).allow("", null),
    //     comment: Joi.string().max(2000).allow("", null),
    //     images: Joi.array().items(
    //         Joi.string().uri()
    //     ).default([])
    // });