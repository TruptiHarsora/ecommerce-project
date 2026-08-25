const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");
const mongoose = require("mongoose");
const Cart = require("../models/Cart.js");
const Seller = require("../models/Seller.js");

const getVariant = (product, sku) => {
  return product?.variants?.find((v) => v.sku === sku);
};

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    const userId = req.user.id;
    const { shippingAddress, paymentInfo } = req.body;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: userId }).session(session);

      if (!cart || !cart?.items?.length) {
        throw new Error("Cart is empty");
      }
      // console.log("createOrder CART", cart);
      let itemTotal = 0;
      let totalDiscount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product || !product.isActive) {
          throw new Error("Product not found");
        }

        const variant = getVariant(product, item.variantSku);

        if (!variant || !variant.isActive) {
          throw new Error("Variant not found");
        }

        const sellerData = product.sellers.find(
          (s) => s.seller.toString() === item.seller.toString(),
        );

        if (!sellerData || sellerData.stock < item.quantity) {
          throw new Error(`${product.title} is Out of stock`);
        }

        itemTotal += item.priceAtTime * item.quantity;

        // orderItems.push({
        //     product: item.product,
        //     title: item.title,
        //     seller: item.seller,
        //     variantSku: item.variantSku,
        //     variantImg: item.variantImg,
        //     quantity: item.quantity,
        //     price: item.priceAtTime,
        // });

        orderItems.push({
          product: item.product,
          seller: item.seller,
          title: product.title,
          variantSku: item.variantSku,
          variantImg: item.variantImg,
          price: item.priceAtTime,
          quantity: item.quantity,
          orderStatus: "placed",
        });
      }

      const tax = Math.round(itemTotal * 0.18);
      const shipping = itemTotal > 1000 ? 0 : 50;

      const [order] = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            shippingAddress,
            paymentInfo: {
              method: paymentInfo?.method || "cod",
              status: "pending",
            },
            pricing: {
              itemTotal,
              tax,
              shipping,
              discount: totalDiscount,
              grandTotal: itemTotal + tax + shipping - totalDiscount,
            },
          },
        ],
        { session },
      );

      createdOrder = order;
      await Cart.updateOne(
        { _id: cart._id },
        {
          $set: { items: [] },
        },
        { session },
      );
    });
    res.status(201).json({
      success: true,
      message: "Order placed",
      order: createdOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

const confirmOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    await session.withTransaction(async () => {
      const order = await Order.findById(id).session(session);

      if (!order) {
        throw new Error("Order not found");
      }

      // Reduce stock
      for (const item of order.items) {
        const result = await Product.updateOne(
          {
            _id: item.product,
            "sellers.seller": item.seller,
            "sellers.stock": { $gte: item.quantity },
          },
          {
            $inc: { "sellers.$.stock": -item.quantity },
          },
          { session },
        );

        if (result.modifiedCount === 0) {
          throw new Error(`Insufficient stock for ${item.title}`);
        }
      }

      // Confirm all items
      order.items.forEach((item) => {
        if (item.orderStatus === "placed") {
          item.orderStatus = "confirmed";
        }
      });

      await order.save({ session });
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, itemId } = req.body;
    const sellerId = req.seller._id;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const item = order.items.id(itemId);

    if (!item || item.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can update only your own items",
      });
    }

    const allowedTransitions = {
      placed: ["confirmed", "cancelled"],
      confirmed: ["shipped", "cancelled"],
      shipped: ["out_for_delivery"],
      out_for_delivery: ["delivered"],
      delivered: [],
      cancelled: [],
    };

    if (!allowedTransitions[item.orderStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change ${item.orderStatus} → ${status}`,
      });
    }

    item.orderStatus = status;

    if (status === "delivered") {
      item.deliveredAt = new Date();

      await Seller.findByIdAndUpdate(item.seller, {
        $inc: {
          earnings: item.price * item.quantity,
          totalOrders: 1,
        },
      });
    }

    if (status === "cancelled") {
      item.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Item status updated successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelOrderItem = async (req, res) => {
  const { orderId, itemId } = req.params;
  console.log("params", req.params);

  const order = await Order.findOne({ _id: orderId, user: req.user.id });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  const item = order.items.id(itemId);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Item not found",
    });
  }

  if (item.orderStatus !== "placed") {
    return res.status(400).json({
      success: false,
      message: "Only placed items can be cancelled",
    });
  }

  item.orderStatus = "cancelled";
  item.cancelledAt = new Date();

  const activeItems = order.items.filter(
    (item) => item.orderStatus !== "cancelled",
  );

  const itemTotal = activeItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const tax = Math.round(itemTotal * 0.18);

  const shipping = itemTotal > 1000 ? 0 : itemTotal > 0 ? 50 : 0;

  const discount = order.pricing.discount || 0;

  const grandTotal = itemTotal + tax + shipping - discount;

  order.pricing.itemTotal = itemTotal;
  order.pricing.tax = tax;
  order.pricing.shipping = shipping;
  order.pricing.grandTotal = grandTotal;

  // If everything is cancelled
  if (activeItems.length === 0) {
    order.pricing.itemTotal = 0;
    order.pricing.tax = 0;
    order.pricing.shipping = 0;
    order.pricing.grandTotal = 0;
  }

  await order.save();
  res.json({
    success: true,
    message: "Item cancelled successfully",
    order,
  });
};

const removeOrder = async (req, res) => {
  let session;
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OrderId",
      });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const order = await Order.findById(id).session(session);

    if (!order) {
      throw new Error("Order not Found");
    }

    if (order.orderStatus === "cancelled") {
      throw new Error("Already cancelled");
    }

    if (order.orderStatus === "confirmed") {
      for (const item of order.items) {
        const result = await Product.updateOne(
          {
            _id: item.product,
            "sellers.seller": item.seller,
            "sellers.variantSku": item.variantSku,
          },
          {
            $inc: { "sellers.$.stock": item.quantity },
          },
          { session },
        );
        if (result.modifiedCount === 0) {
          throw new Error(`Stock rollback failed for ${item.title}`);
        }
      }
    }

    // order.orderStatus = "cancelled";
    order.items.forEach((item) => {
      if (item.orderStatus !== "delivered") {
        item.orderStatus = "cancelled";
        item.cancelledAt = new Date();
      }
    });

    await order.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    res.status(400).json({
      success: false,
      message: error.message,
      order,
    });
  } finally {
    if (session) session.endSession();
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "title images")
      .populate("items.seller", "shopName");

    console.log("orderrr:", order);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "title images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({ user: userId });

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  confirmOrder,
  updateOrderStatus,
  cancelOrderItem,
  removeOrder,
  getOrderById,
  getUserOrders,
};
