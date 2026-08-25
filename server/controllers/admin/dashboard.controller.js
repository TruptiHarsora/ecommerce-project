const User = require("../../models/User.js");
const Order = require("../../models/Order.js");
const Product = require("../../models/Product.js");

const getDashboard = async (req, res) => {
  try {
    // const totalUsers = await User.countDocuments();
    // const totalOrders = await Order.countDocuments();
    // const totalProducts = await Product.countDocuments();
    // const pendingOrders = await Order.countDocuments({ orderStatus: "Pending" });

    const [totalUsers, totalOrders, totalProducts, pendingOrders] =
      await Promise.all([
        User.countDocuments(),
        Order.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments({
          orderStatus: {
            $in: ["placed", "confirmed", "shipped", "out_for_delivery"],
          },
        }),
      ]);

    const revenueData = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$pricing.grandTotal",
          },
        },
      },
    ]);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
          },
          revenue: {
            $sum: "$pricing.grandTotal",
          },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
    ]);

    const recentOrder = await Order.find()
      .select("user pricing orderStatus createdAt")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      revenue: revenueData[0]?.totalRevenue || 0,
      recentOrder,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };
