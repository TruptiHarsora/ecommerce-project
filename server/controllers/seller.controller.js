const Product = require("../models/Product.js");
const Seller = require("../models/Seller.js");
const User = require("../models/User.js");
const Order = require("../models/Order");


const becomeSeller = async (req, res) => {

    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const existing = await Seller.findOne({ user: userId });

        if (existing) {
            return res.json({
                success: false,
                message: "Already a seller"
            });
        }

        const { shopName, gstNumber } = req.body;

        if (!shopName) {
            return res.status(400).json({
                success: false,
                message: "Shop name required"
            });
        }

        const seller = await Seller.create({
            user: userId,
            shopName: shopName.trim(),
            gstNumber: gstNumber || null,
            status: "active"
        });

        // await User.findByIdAndUpdate(userId, { role: "seller" });
        user.role = "seller";
        user.sellerProfile = seller._id;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Seller account created",
            seller
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getSellerProducts = async (req, res) => {
    try {

        const sellerId = req.seller._id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.find({
            "sellers.seller": sellerId
        })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 })

        const total = await Product.countDocuments({
            "sellers.seller": sellerId
        });

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.seller._id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const orders = await Order.find({
            "items.seller": sellerId
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Order.countDocuments({
            "items.seller": sellerId
        });

        res.json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            orders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getSellerDashboard = async (req, res) => {
    try {
        const sellerId = req.seller._id;

        const orders = await Order.find({
            "items.seller": sellerId
        });

        let totalSales = 0;
        let pendingOrders = 0;

        for (const order of orders) {
            if (order.orderStatus !== "delivered") {
                pendingOrders++;
            }

            for (const item of order.items) {
                if (item.seller.toString() === sellerId.toString()) {
                    totalSales += item.price * item.quantity;
                }
            }
        }

        res.json({
            success: true,
            data: {
                totalSales,
                totalOrders: orders.length,
                pendingOrders,
                earnings: req.seller.earnings
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    becomeSeller,
    getSellerProducts,
    getSellerOrders,
    getSellerDashboard
};


