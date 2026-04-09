const mongoose = required("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.Now }
    }]
}, { timestamps: true });

wishlistSchema.index({ user: 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);