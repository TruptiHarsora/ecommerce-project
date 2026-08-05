const Review = require("../../models/Review");

const getAllReviewsAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find()
      .populate("user", "name")
      .populate("product", "title images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      reviews,
      totalReviews,
      page,
      totalPages: Math.ceil(totalReviews / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteReviewAdmin = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllReviewsAdmin,
  deleteReviewAdmin,
};

// const Review = require("../../models/Review.js");
// const { logAction } = require("../../utils/logAction.js");

// const getAllReviewsAdmin = async (req, res) => {
//     try {
//         let page = Number(req.params.page) || 1;
//         let limit = Number(req.params.limit) || 20;

//         if (limit > 50) limit = 50;
//         const skip = (page - 1) * limit;

//         const reviews = await Review.find({ isDeleted: false })
//             .populate("user", "name")
//             .populate("product", "title")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         res.json({
//             success: true,
//             reviews
//         })
//     } catch (error) {
//         res.status(400).json({
//             succes: false,
//             message: error.message
//         })
//     }
// }

// const deleteReviewAdmin = async (req, res) => {
//     try {
//         const { id } = req.params;

//         await Review.findByIdAndDelete(id, { isDeleted: true });

//         await logAction({
//             action: "DELETED_REVIEW",
//             performedBy: req.user.id,
//             targetModel: "Review",
//             targetId: id

//         })

//         res.json({
//             success: true,
//             message: "Review removed by Admin"
//         })
//     } catch (error) {
//         res.status(400).json({
//             succes: false,
//             message: error.message
//         })
//     }
// }

// module.exports = { getAllReviewsAdmin, deleteReviewAdmin };
