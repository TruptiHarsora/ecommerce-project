
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" }, //add new
    title: String,
    variantSku: String,
    variantImg: String,
    price: Number,
    quantity: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: { type: [orderItemSchema], required: true },
    // address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    shippingAddress: {
        fullName: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        addressLine1: { type: String, required: true, trim: true },
        addressLine2: { type: String, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        postalCode: { type: String, required: true, trim: true },
        country: { type: String, required: true, trim: true },
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ["cod", "online"],
            default: "cod"
        },
        // paymentId: String,
        // razorpayOrderId: String,
        // razorpayPaymentId: String,
        status: {
            type: String,
            enum: ["created", "pending", "paid", "failed", "refunded"],
            default: "pending"
        }
    },
    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "out_for_delivery", "delivered", "cancelled"],
        default: "placed"
    },
    pricing: {
        itemTotal: Number,
        tax: Number,
        shipping: Number,
        discount: Number,
        grandTotal: Number
    },
    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
}, { timestamps: true });

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1 });

module.exports = mongoose.model("Order", orderSchema);