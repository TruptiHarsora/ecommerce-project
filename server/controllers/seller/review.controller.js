const Review = require("../../models/Review");
const Product = require("../../models/Product");

const getSellerReviews = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get seller's product IDs
    const products = await Product.find({ "sellers.seller": sellerId }, "_id");

    const productIds = products.map((product) => product._id);

    // console.log("Seller Products", products);
    const [reviews, totalReviews] = await Promise.all([
      Review.find({
        product: { $in: productIds },
      })
        .populate("user", "name")
        .populate("product", "title images variants")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Review.countDocuments({
        product: { $in: productIds },
      }),
    ]);

    console.log("review", reviews);
    res.status(200).json({
      success: true,

      pagination: {
        page,
        limit,
        total: totalReviews,
        pages: Math.ceil(totalReviews / limit),
      },

      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSellerReviews,
};
