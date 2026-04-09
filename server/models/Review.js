const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: String,
    comment: String,
    images: [String],
    isVarifiedPurchase: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ product: 1 });

module.exports = mongoose.model("Review", reviewSchema);