const Order = require("../../models/Order");
const Product = require("../../models/Product");
const Seller = require("../../models/Seller");
const User = require("../../models/User");

const getAllSellersAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const sellers = await Seller.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const sellersWithStats = await Promise.all(
      sellers.map(async (seller) => {
        const totalOrder = await Order.countDocuments({
          "items.seller": seller._id,
        });

        const earningsAgg = await Order.aggregate([
          { $unwind: "$items" },
          {
            $match: {
              "items.seller": seller._id,
              "items.orderStatus": "delivered",
            },
          },
          {
            $group: {
              _id: null,
              earnings: {
                $sum: { $multiply: ["$items.price", "$items.quantity"] },
              },
              deliveredItems: { $sum: 1 },
            },
          },
        ]);

        return {
          ...seller.toObject(),
          totalOrder,
          earnings: earningsAgg[0]?.earnings || 0,
          deliveredItems: earningsAgg[0]?.deliveredItems || 0,
        };
      }),
    );

    const total = await Seller.countDocuments();

    res.status(200).json({
      success: true,
      sellers: sellersWithStats,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSellerDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const seller = await Seller.findById(id).populate(
      "user",
      "name email avatar isVerified",
    );

    if (!seller) {
      res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const [productCount, orderCount, recentProducts, recentOrders] =
      await Promise.all([
        Product.countDocuments({ "sellers.seller": seller._id }),
        Order.countDocuments({ "items.seller": seller._id }),
        Product.find({ "sellers.seller": seller._id })
          .select("title images  brand category sellers isActive")
          .populate("category", "name")
          .sort({ createdAt: -1 })
          .limit(5),
        Order.find({ "items.seller": seller._id })
          .populate("user", "name")
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const formattedProducts = recentProducts.map((product) => {
      const sellerInfo = product.sellers.find((s) =>
        s.seller.equals(seller._id),
      );

      return {
        ...product.toObject(),
        price: sellerInfo?.price ?? 0,
        stock: sellerInfo?.stock ?? 0,
      };
    });

    const earningsAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          "items.seller": seller._id,
          "items.orderStatus": "delivered",
        },
      },
      {
        $group: {
          _id: null,
          earnings: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          deliveredItems: { $sum: 1 },
        },
      },
    ]);
    const ratingAgg = await Product.aggregate([
      {
        $match: { "sellers.seller": seller._id },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$ratingAverage" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      seller,
      stats: {
        products: productCount,
        orders: orderCount,
        earnings: earningsAgg[0]?.earnings || 0,
        rating: ratingAgg[0]?.avgRating || 0,
      },
      recentProducts: formattedProducts,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifySellerAdmin = async (req, res) => {
  try {
    // console.log("Seller ID:", req.params.id);
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      seller.user,
      {
        isVerified: true,
      },
      {
        new: true,
      },
    );

    // console.log("After:", seller);
    res.json({
      success: true,
      message: "Seller verified successfully",
      seller,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateSellerStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      id,
      { status },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).populate("user", "name email");

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.json({
      success: true,
      message: "Seller status updated successfully",
      seller,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getAllSellersAdmin,
  getSellerDetailsAdmin,
  verifySellerAdmin,
  updateSellerStatusAdmin,
};
