const Order = require("../models/Order.js");

const checkVerifiedPurchases = async (userId, productId) => {
    const order = await Order.findOne({
        user: userId,
        "items.product": productId,
        orderStatus: "delivered"
    });
    // return !!order;
    return Boolean(order);
}

module.exports = { checkVerifiedPurchases };