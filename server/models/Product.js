const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    attributes: {
        type:Map,
        of: String,
    },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    stock: { type: Number, default: 0 },
    images: [String],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });


const specificationSchema = new mongoose.Schema({
    group: String,
    key: String,
    value: String
}, { _id: false });


const sellerSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    price: Number,
    stock: Number,
    isActive: { type: Boolean, default: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    brand: String,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    images: [String],
    variants: [variantSchema],
    specification:[specificationSchema],
    sellers: [sellerSchema],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    tags: [ String ],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ title: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ "variants.sku": 1 });

module.exports = mongoose.model("Product", productSchema);  