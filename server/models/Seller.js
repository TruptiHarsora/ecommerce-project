const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    shopName: {
      type: String,
      trim: true,
      required: true,
      minlength: 2,
      maxlength: 60,
    },

    gstNumber: { type: String, trim: true, default: null },
    // isVerified: { type: Boolean, default: false },
    logo: String,
    businessPhone: { type: String, trim: true },

    pickupAddress: {
      addressLine1: String,
      city: String,
      state: String,
      postalCode: String,
    },

    // bankDetails: {
    //   accountHolder: String,
    //   accountNumber: String,
    //   ifscCode: String,
    // },

    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
    },

    earnings: { type: Number, default: 0 },
    totalOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Seller", sellerSchema);
