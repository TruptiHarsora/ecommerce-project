const Order = require("../../models/Order.js");

const getAllOrdersAdmin = async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 20;
    let { status } = req.query;

    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.orderStatus = status;

    const orders = await Order.find(filter)
      .select("user items pricing orderStatus createdAt")
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
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // console.log("orderStatus", req.body);

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;

    if (orderStatus === "delivered" && order.paymentInfo.status !== "paid") {
      order.paymentInfo.status = "paid";
      order.paidAt = new Date();
      order.deliveredAt = new Date();
    }

    // console.log("Saving order status:", order.orderStatus);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Status Updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { getAllOrdersAdmin, updateOrderStatusAdmin };
