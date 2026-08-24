const Order = require("../models/Order.js");

const checkVerifiedPurchases = async (userId, productId) => {
  const order = await Order.findOne({
    user: userId,
    "items.product": productId,
    "items.orderStatus": "delivered",
  });
  console.log("order", order);
  // return !!order;
  return Boolean(order);
};

module.exports = { checkVerifiedPurchases };
