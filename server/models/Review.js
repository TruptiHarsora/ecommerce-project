const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true, maxlength: 100 },
    comment: { type: String, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulUsers: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index(
    { user: 1, product: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);
reviewSchema.index({ product: 1, createdAt: -1 });

reviewSchema.statics.updateRatingStats = async function (productId) {
    const stats = await this.aggregate([
        {
            $match: {
                product: productId,
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    const Product = mongoose.model("Product");

    await Product.findByIdAndUpdate(productId, {
        ratingAverage: stats[0]?.avgRating || 0,
        ratingCount: stats[0]?.count || 0
    });
};


reviewSchema.post("save", async function () {
    await this.constructor.updateRatingStats(this.product);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
    if (doc) {
        await doc.constructor.updateRatingStats(doc.product);
    }
})

module.exports = mongoose.model("Review", reviewSchema);