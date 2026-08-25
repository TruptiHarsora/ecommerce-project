const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, trim: true, maxlength: 100 },
    comment: { type: String, trim: true, maxlength: 2000 },
    images: { type: [String], default: [] },
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    helpfulUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

reviewSchema.index(
  { user: 1, product: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
reviewSchema.index({ product: 1, createdAt: -1 });

reviewSchema.statics.updateRatingStats = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        isDeleted: false,
      },
    },

    {
      $group: {
        _id: "$product",

        ratingSum: {
          $sum: "$rating",
        },

        ratingCount: {
          $sum: 1,
        },

        ratingAverage: {
          $avg: "$rating",
        },
      },
    },
  ]);

  const Product = mongoose.model("Product");

  const ratingSum = stats[0]?.ratingSum || 0;
  const ratingCount = stats[0]?.ratingCount || 0;

  const ratingAverage =
    ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(1)) : 0;

  await Product.findByIdAndUpdate(productId, {
    $set: {
      ratingSum,
      ratingCount,
      ratingAverage,
    },
  });
};

// reviewSchema.post("save", async function () {
//     await this.constructor.updateRatingStats(this.product);
// });

// reviewSchema.post("findOneAndUpdate", async function (doc) {
//     if (doc) {
//         await doc.constructor.updateRatingStats(doc.product);
//     }
// })

// reviewSchema.post("findOneAndDelete", async function (doc) {
//     if (doc) {
//         await doc.constructor.updateRatingStats(doc.product);
//     }
// })

module.exports = mongoose.model("Review", reviewSchema);
