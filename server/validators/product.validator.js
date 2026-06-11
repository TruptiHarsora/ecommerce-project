const Joi = require("joi");

const variantSchema = Joi.object({
    sku: Joi.string().trim().uppercase().required(),
    attributes: Joi.object().pattern(Joi.string(), Joi.string()),
    // price: Joi.number().min(0).required(),
    // discountPrice: Joi.number().min(0).less(Joi.ref("price")),
    // stock: Joi.number().min(0).default(0),
    images: Joi.array().items(Joi.string()),
    isActive: Joi.boolean().default(true),
});

const specificationSchema = Joi.object({
    group: Joi.string().trim().required(),
    key: Joi.string().trim().required(),
    value: Joi.string().trim().required(),
});

// const specificationSchema = Joi.array().items(
//   Joi.object({
//     group: Joi.string().trim().required(),
//     key: Joi.string().trim().required(),
//     value: Joi.string().trim().required(),
//   })
// );

const sellerSchema = Joi.object({
    seller: Joi.string().hex().length(24).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).default(0),
    isActive: Joi.boolean().default(true),
});


const createProductSchema = Joi.object({
    title: Joi.string().trim().required(),
    description: Joi.string().allow(""),
    brand: Joi.string().allow(""),
    category: Joi.string().hex().length(24).required(),
    images: Joi.array().items(Joi.string().uri()),

    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ),

    isFeatured: Joi.boolean(),
    isActive: Joi.boolean(),

    variants: Joi.array().items(variantSchema),
    specification: Joi.array().items(specificationSchema),
    sellers: Joi.array().items(sellerSchema),
});

const updateProductSchema = Joi.object({
    title: Joi.string().trim().min(2).max(120),
    description: Joi.string().trim().allow(""),
    brand: Joi.string().trim().allow(""),
    category: Joi.string().hex().length(24),
    images: Joi.array().items(Joi.string().uri()),
    tags: Joi.alternatives().try(
        Joi.array().items(Joi.string().trim()),
        Joi.string()
    ),
    isFeatured: Joi.boolean(),
    isActive: Joi.boolean(),
    variants: Joi.array().items(variantSchema),
    specification: Joi.array().items(specificationSchema),
    sellers: Joi.array().items(sellerSchema),
});


const queryProductSchema = Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(50).default(10),

    search: Joi.string().max(50),
    category: Joi.string().hex().length(24),
    brand: Joi.string(),

    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),

    rating: Joi.number().min(0).max(5),

    // sort: Joi.string().valid("price_asc", "price_desc", "newest"),
    sort: Joi.string().valid("lowToHigh", "highToLow", "latest"),
    
});

module.exports = {
    createProductSchema,
    queryProductSchema,
    updateProductSchema,
    specificationSchema,
    sellerSchema
};
