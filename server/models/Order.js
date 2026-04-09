const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    title: String,
    variantSku: String,
    price: Number,
    quantity: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    paymentInfo: {
        method: String,
        paymentId: String,
        razopayOrderId: String,
        razopayPaymentId: String,
        status: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        }
    },
    orderStatus: {
        type: String,
        enum: ["placed", "confirmed", "shipped", "out_for_delivery", "deliverd", "cancelled"],
        default: "placed"
    },
    pricing: {
        itemTotal: Number,
        tax: Number,
        shiping: Number,
        discount: Number,
        grandTotal: Number
    },
    paidAt: Date,
    deliverdAT:Date
},{timestamps:True});

orderSchema.index({user:1, createdAt:-1});

module.exports = mongoose.model("Order", orderSchema);