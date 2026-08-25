const Order = require("../../models/Order");
const Product = require("../../models/Product");

const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const [orders, totalProducts, recentOrders, lowStockProducts, ratingData] =
      await Promise.all([
        // All seller orders
        Order.find({ "items.seller": sellerId }),

        // Total products
        Product.countDocuments({ "sellers.seller": sellerId }),

        // Recent orders
        // Order.find({ "items.seller": sellerId, })
        //     .populate("user", "name email")
        //     .sort({ createdAt: -1 })
        //     .limit(5),
        Order.find({ "items.seller": sellerId })
          .select("user pricing orderStatus createdAt items")
          .populate("user", "name email")
          .sort({ createdAt: -1 })
          .limit(5),

        // Low stock products
        Product.find({
          sellers: {
            $elemMatch: {
              seller: sellerId,
              stock: { $lte: 5 },
            },
          },
        })
          .select("title images sellers")
          .limit(5),

        // Average rating
        Product.aggregate([
          {
            $match: { "sellers.seller": sellerId },
          },
          {
            $group: {
              _id: null,
              averageRating: {
                $avg: "$ratingAverage",
              },
            },
          },
        ]),
      ]);

    let totalSales = 0;
    let pendingOrders = 0;

    for (const order of orders) {
      if (
        order.orderStatus !== "delivered" &&
        order.orderStatus !== "cancelled"
      ) {
        pendingOrders++;
      }

      for (const item of order.items) {
        if (
          item.seller.toString() === sellerId.toString() &&
          item.orderStatus === "delivered"
        ) {
          totalSales += (item.price || 0) * (item.quantity || 0);
        }
      }
    }

    const earningsAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: { "items.seller": sellerId, "items.orderStatus": "delivered" },
      },
      {
        $group: {
          _id: null,
          earnings: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
    ]);
    // console.log("earning Agg", earningsAgg);

    res.status(200).json({
      success: true,

      stats: {
        // totalSales,
        earnings: earningsAgg[0]?.earnings || 0,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts,
        averageRating: ratingData[0]?.averageRating || 0,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSellerDashboard,
};
