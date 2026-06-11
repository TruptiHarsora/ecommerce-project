const Order = require("../../models/Order.js");

const getAllOrdersAdmin = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 20;
        let { status } = req.query;

        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;
        
        const filter = {};
        if(status) filter.orderStatus = status;
        
        const orders = await Order.find(filter)
            .select("user pricing orderStatus createdAt")
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrder = await Order.countDocuments(filter);


        res.json({
            success: true,
            totalOrder,
            page,
            pages: Math.ceil(totalOrder / limit),
            orders
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { getAllOrdersAdmin };