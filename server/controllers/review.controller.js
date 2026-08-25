const mongoose = require("mongoose");

const Review = require("../models/Review");
const Product = require("../models/Product");

const { checkVerifiedPurchases } = require("../utils/checkVerifiedPurchase");

const compressImage = require("../utils/compressImage");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createReview = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { productId } = req.params;

    const { rating, title, comment } = req.body;

    const numRating = Number(rating);

    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    let createdReview;

    await session.withTransaction(async () => {
      // Product

      const product = await Product.findById(productId).session(session);

      if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
      }

      // Existing review

      const existingReview = await Review.findOne({
        user: req.user.id,
        product: productId,
        isDeleted: false,
      }).session(session);

      if (existingReview) {
        const error = new Error("You already reviewed this product");

        error.statusCode = 400;
        throw error;
      }

      // Verified purchase

      const isVerified = await checkVerifiedPurchases(req.user.id, productId);

      // Images

      let uploadImages = [];

      const reviewFiles = req.files || [];

      if (reviewFiles.length > 5) {
        const error = new Error("Maximum 5 images allowed");

        error.statusCode = 400;
        throw error;
      }

      if (reviewFiles.length > 0) {
        uploadImages = await Promise.all(
          reviewFiles.map(async (file) => {
            if (!file.mimetype?.startsWith("image/")) {
              throw new Error("Only image files are allowed");
            }

            if (file.size > 5 * 1024 * 1024) {
              throw new Error("File too large. Maximum size is 5MB");
            }

            const compressed = await compressImage(file.buffer);

            const result = await uploadToCloudinary(compressed, "reviews");

            return result.secure_url;
          }),
        );
      }

      // Create Review

      const review = new Review({
        user: req.user.id,
        product: productId,
        rating: numRating,
        title: title?.trim(),
        comment: comment?.trim(),
        images: uploadImages,
        isVerifiedPurchase: isVerified,
      });

      await review.save({
        session,
      });

      createdReview = review;
    });

    // Recalculate rating AFTER transaction

    await Review.updateRatingStats(productId);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: createdReview,
    });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to create review",
    });
  } finally {
    await session.endSession();
  }
};

const updateReview = async (req, res) => {
  try {
    const review = req.review;

    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Check ownership

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // Rating

    if (req.body.rating !== undefined) {
      const newRating = Number(req.body.rating);

      if (!Number.isInteger(newRating) || newRating < 1 || newRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = newRating;
    }

    // Title

    if (req.body.title !== undefined) {
      review.title = req.body.title.trim();
    }

    // Comment

    if (req.body.comment !== undefined) {
      review.comment = req.body.comment.trim();
    }

    // Images

    if (req.files?.length) {
      if (req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: "Maximum 5 images allowed",
        });
      }

      const uploadedImages = [];

      for (const file of req.files) {
        if (!file.mimetype?.startsWith("image/")) {
          return res.status(400).json({
            success: false,
            message: "Only image files are allowed",
          });
        }

        if (file.size > 5 * 1024 * 1024) {
          return res.status(400).json({
            success: false,
            message: "File too large. Maximum size is 5MB",
          });
        }

        const compressed = await compressImage(file.buffer);

        const result = await uploadToCloudinary(compressed, "reviews");

        uploadedImages.push(result.secure_url);
      }

      review.images = uploadedImages;
    }

    await review.save();

    await Review.updateRatingStats(review.product);

    // Get updated product rating
    const product = await Product.findById(review.product).select(
      "ratingSum ratingCount ratingAverage",
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
      rating: {
        ratingSum: product.ratingSum,
        ratingCount: product.ratingCount,
        ratingAverage: product.ratingAverage,
      },
    });
  } catch (error) {
    console.error("UPDATE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update review",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = req.review;

    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    const productId = review.product;

    review.isDeleted = true;

    await review.save();

    await Review.updateRatingStats(productId);

    const product = await Product.findById(productId).select(
      "ratingSum ratingCount ratingAverage",
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",

      review,

      rating: {
        ratingSum: product?.ratingSum || 0,
        ratingCount: product?.ratingCount || 0,
        ratingAverage: product?.ratingAverage || 0,
      },
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete review",
    });
  }
};

const markHelpful = async (req, res) => {
  try {
    // const review = await Review.findById(req.params.id);

    // if (!review || review.isDeleted) {
    //     return res.status(404).json({ message: "Review not found" });
    // }

    // const userId = req.user.id;

    // review.helpfulUsers = review.helpfulUsers || [];

    // if (review.helpfulUsers.includes(userId)) {
    //     return res.status(400).json({ message: "Already voted" });
    // }

    // review.helpfulUsers.push(userId);
    // review.helpfulCount = (review.helpfulCount || 0) + 1;
    // await review.save();

    const userId = req.user.id;

    const updated = await Review.findOneAndUpdate(
      {
        _id: req.params.id,
        helpfulUsers: { $ne: userId }, // user hasn't voted yet
        isDeleted: false,
      },
      {
        $addToSet: { helpfulUsers: userId },
        $inc: { helpfulCount: 1 },
      },
      { new: true },
    );

    if (!updated) {
      return res.status(200).json({
        success: true,
        message: "Already voted or review not found",
      });
    }
    // console.log("Helpful", updated);
    // res.json({ success: true, helpfulCount: updated.helpfulCount });
    res.json({ success: true, review: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isDeleted: false,
    })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      product: req.params.productId,
      user: req.user.id,
      isDeleted: false,
    });

    return res.json({
      success: true,
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      user: req.user.id,
      isDeleted: false,
    })
      .populate("product", "title images brand")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const getSellerReviews = async (req, res) => {
//   try {
//     const sellerId = req.seller._id;

//     const productIds = await Product.find({
//       "sellers.seller": sellerId,
//     }).distinct("_id");

//     const reviews = await Review.find({
//       product: { $in: productIds },
//       isDeleted: false,
//     })
//       .populate("user", "name email")
//       .populate("product", "title")
//       .sort({ createdAt: -1 })
//       .lean();

//     res.status(200).json({
//       success: true,
//       count: reviews.length,
//       reviews,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       messsage: error.message,
//     });
//   }
// };

// const getAdminAllReviews = async (req, res) => {
//   try {
//     const reviews = await Review.find({
//       isDeleted: false,
//     })
//       .populate("user", "name email")
//       .populate("product", "title")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: reviews.length,
//       reviews,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
module.exports = {
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getProductReviews,
  getMyReview,
  getMyReviews,
  //   getSellerReviews,
  //   getAdminAllReviews,
};
