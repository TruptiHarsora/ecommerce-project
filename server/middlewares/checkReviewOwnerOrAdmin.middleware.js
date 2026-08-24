const Review = require("../models/Review");

const checkReviewOwnerOrAdmin = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // attach review to request for later use
    req.review = review;

    const isOwner = review.user.toString() === req.user.id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed (owner or admin only)",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = checkReviewOwnerOrAdmin;
