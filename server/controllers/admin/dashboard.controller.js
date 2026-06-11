const User = require("../../models/User.js");
const Order = require("../../models/Order.js");
const Product = require("../../models/Product.js");

const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalProducts = await Product.countDocuments();

        const revenueData = await Order.aggregate([
            { $match: { "paymentInfo.statys": "paid" } },
            {
                $group: {
                    _id: null,
                    totalRevenu: { $sum: "$pricing.grandTotal" }
                }
            }
        ]);

        const recentOrder = await Order.find()
            .select("user pricing orderStatus createdAt")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            totalUser,
            totalOrders,
            totalProducts,
            revenue: revenueData[0]?.totalRevenu || 0,
            recentOrder
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getDashboard };