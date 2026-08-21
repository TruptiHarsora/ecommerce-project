const mongoose = require("mongoose");
const Review = require("../models/Review.js");
const Product = require("../models/Product.js");
const { checkVerifiedPurchases } = require("../utils/checkVerifiedPurchase.js");
const scanFile = require("../utils/scanFile.js");
const compressImage = require("../utils/compressImage.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");

const createReview = async (req, res) => {
  console.log("BODY =>", req.body);
  console.log("FILES =>", req.files);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { productId } = req.params;
    const { rating, title, comment, images = [] } = req.body;
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
    const product = await Product.findById(productId).session(session);

    if (!product) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId,
      isDeleted: false,
    }).session(session);

    if (existingReview) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }

    const isVerified = await checkVerifiedPurchases(req.user.id, productId);

    // let uploadedImages = [];
    // const reviewFiles = req.files?.images || [];
    // if (reviewFiles.length) {
    //     for (const file of req.files) {
    //         // await scanFile(file.path);

    //         const compressedPath = await compressImage(file.buffer);

    //         const uploaded = await uploadToCloudinary(
    //             compressedPath,
    //             "reviews"
    //         );

    //         uploadedImages.push(uploaded.secure_url);
    //     }
    // }

    let uploadImages = [];

    const reviewFiles = req.files || [];
    console.log("FILES RECEIVED", req.files);
    if (reviewFiles.length) {
      const uploadTasks = reviewFiles.map(async (file) => {
        if (!file.mimetype.startsWith("image/")) {
          throw new Error("Only image files allowed");
        }

        // if (req.files?.lenght) {
        //     for (const file of req.file) {

        //         if (!file.mimetype.startsWith("image/")) {
        //             return res.status(400).json({
        //                 success: false,
        //                 message: "Only image files allowed"
        //             });
        //         }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("File too large (max 5MB)");
        }
        //virus scan
        // await scanFile(file.buffer);

        //compress
        const compressed = await compressImage(file.buffer);

        //uploadFile
        const result = await uploadToCloudinary(compressed);

        // images.push(result.secure.url);
        return result.secure_url;
      });

      uploadImages = await Promise.all(uploadTasks);
    }

    console.log("UPLOADED IMAGES", uploadImages);
    const review = await Review.create(
      [
        {
          user: req.user.id,
          product: productId,
          rating: numRating,
          title,
          comment,
          images: uploadImages || [],
          isVerifiedPurchase: isVerified,
        },
      ],
      { session },
    );

    // product.ratingSum = (product.ratingSum || 0) + numRating;
    // product.ratingCount = (product.ratingCount || 0) + 1;
    // product.ratingAverage = product.ratingCount === 0
    //     ? 0
    //     : Number((product.ratingSum / product.ratingCount).toFixed(1));

    // product.ratingAverage = product.ratingSum / product.ratingCount;
    // product.ratingAverage =
    //     product.ratingCount === 0 ? 0
    //         : product.ratingSum / product.ratingCount;

    // await product.save({ session });

    console.log("REVIEW CREATED", review);

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      review: review[0],
    });
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

const updateReview = async (req, res) => {
  console.log("BODY =>", req.body);
  console.log("FILES =>", req.files);

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).session(session);

    if (!review) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "review not found",
      });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      await session.abortTransaction();

      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // const product = await Product.findById(review.product).session(session);

    // if (!product) {
    //     await session.abortTransaction();

    //     return res.status(404).json({
    //         success: false,
    //         message: "Product not found"
    //     });
    // }
    // const oldRating = review.rating;

    if (
      req.body.rating !== undefined &&
      (Number(req.body.rating) < 1 || Number(req.body.rating) > 5)
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    // review.rating = req.body.rating !== undefined
    //     ? Number(req.body.rating)
    //     : review.rating;
    // review.title = req.body.title ?? review.title;
    // review.comment = req.body.comment ?? review.comment;

    review.rating =
      req.body.rating !== undefined ? req.body.rating : review.rating;

    review.title = req.body.title !== undefined ? req.body.title : review.title;

    review.comment =
      req.body.comment !== undefined ? req.body.comment : review.comment;

    // if (req.body.images) {
    //     review.images = req.body.images;
    // }

    if (req.files?.length) {
      let uploadedImages = [];

      for (const file of req.files) {
        // await scanFile(file.path);

        const compressedPath = await compressImage(file.buffer);

        const uploaded = await uploadToCloudinary(compressedPath, "reviews");

        uploadedImages.push(uploaded.secure_url);
      }

      review.images = uploadedImages;
    }

    await review.save({ session });

    // product.ratingSum = (product.ratingSum || 0) - oldRating + review.rating;
    // product.ratingSum -= oldRating;
    // product.ratingSum += review.rating;
    // product.ratingAverage = product.ratingCount === 0
    //     ? 0 : Number((product.ratingSum / product.ratingCount).toFixed(1));

    // await product.save({ session });
    await session.commitTransaction();

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

const deleteReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).session(session);

    if (!review) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "review not found",
      });
    }

    if (review.user.toString() !== req.user.id.toString()) {
      await session.abortTransaction();

      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // const product = await Product.findById(review.product).session(session);

    // if (!product) {
    //     await session.abortTransaction();

    //     return res.status(404).json({
    //         success: false,
    //         message: "Product not found"
    //     });
    // }

    review.isDeleted = true;

    await review.save({ session });

    // product.ratingCount -= 1;
    // product.ratingSum -= review.rating;

    // if (product.ratingCount <= 0) {
    //     product.ratingCount = 0;
    //     product.ratingSum = 0;
    // }

    // // product.ratingCount = Math.max(0, (product.ratingCount || 0) - 1);
    // // product.ratingSum = Math.max(0, (product.ratingSum || 0) - review.rating);

    // product.ratingAverage =
    //     product.ratingCount === 0
    //         ? 0
    //         : Number((product.ratingSum / product.ratingCount).toFixed(1));

    // await product.save({ session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Review deleted",
      review,
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
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
    console.log("Helpful", updated);
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
