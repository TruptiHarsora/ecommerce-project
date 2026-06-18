const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    }, // new added
    variantSku: { type: String, required: true },
    variantImg: { type: String },
    quantity: { type: Number, default: 1 },
    priceAtTime: Number
    // }, { _id: false });
});


const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [cartItemSchema],
    totalAmount: Number,
}, { timestamps: true });

// cartSchema.index({ user: 1 });

module.exports = mongoose.model("Cart", cartSchema);