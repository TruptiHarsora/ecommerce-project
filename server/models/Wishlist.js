const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            
        },
        variantSku: String,
        addedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// wishlistSchema.index({ user: 1 });

module.exports = mongoose.model("Wishlist", wishlistSchema);