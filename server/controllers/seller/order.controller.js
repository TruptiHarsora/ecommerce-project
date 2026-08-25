const Order = require("../../models/Order");

// Allowed Order Status Transitions

const allowedTransitions = {
  placed: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
  cancelled: [],
};

const validStatuses = Object.keys(allowedTransitions);

const formatSellerOrder = (order, sellerId) => {
  const sellerItems = order.items.filter((item) => {
    const itemSellerId =
      item.seller?._id?.toString() || item.seller?.toString();
    return itemSellerId === sellerId.toString();
  });
  const sellerTotal = sellerItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return { ...order, items: sellerItems, sellerTotal };
};

// Get Seller Orders

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, sort = "latest" } = req.query;

    const filter = { "items.seller": sellerId };

    // if (status) {
    //   filter.orderStatus = status;
    // }

    if (status) {
      filter["items.orderStatus"] = status;
    }
    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .select(
          "user items pricing paymentInfo shippingAddress orderStatus createdAt deliveredAt",
        )
        .populate("user", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    const formattedOrders = orders.map((order) =>
      formatSellerOrder(order, sellerId),
    );

    res.status(200).json({
      success: true,

      orders: formattedOrders,

      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Seller Order By Id
// ======================================

const getSellerOrderById = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      "items.seller": sellerId,
    })
      .select(
        "user items pricing paymentInfo shippingAddress orderStatus createdAt deliveredAt",
      )
      .populate("user", "name email phone")
      .populate("items.seller", "shopName")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order: formatSellerOrder(order, sellerId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Seller Order Status

const updateSellerOrderStatus = async (req, res) => {
  try {
    const sellerId = req.seller._id;
    const { id } = req.params;
    const { itemId, status } = req.body;

    // console.log("BODY =>", req.body);
    // console.log("STATUS =>", status);
    // console.log("VALID =>", validStatuses);

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findOne({
      _id: id,
      "items.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const item = order.items.find(
      (i) =>
        i._id.toString() === itemId &&
        i.seller.toString() === sellerId.toString(),
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Order item not found.",
      });
    }

    const currentStatus = item.orderStatus;
    const nextStatuses = allowedTransitions[currentStatus] || [];

    if (!nextStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change item from "${currentStatus}" to "${status}".`,
      });
    }

    item.orderStatus = status;

    if (status === "delivered") {
      item.deliveredAt = new Date();
    }

    if (status === "cancelled") {
      item.cancelledAt = new Date();
    }

    const allDelivered = order.items.every(
      (i) => i.orderStatus === "delivered",
    );

    if (allDelivered) {
      order.paymentInfo.status = "paid";
      order.paidAt = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate("user", "name email phone")
      .lean();

    res.status(200).json({
      success: true,
      message: "Item status updated successfully.",
      order: formatSellerOrder(updatedOrder, sellerId),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getSellerOrders,
  getSellerOrderById,
  updateSellerOrderStatus,
};
