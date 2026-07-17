const Order = require("../../models/Order");
const Seller = require("../../models/Seller");

const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.seller._id;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const { status, sort = "latest" } = req.query;

        const filter = { "items.seller": sellerId, };

        if (status) {
            filter.orderStatus = status;
        }

        const sortOption = sort === "oldest"
            ? { createdAt: 1 }
            : { createdAt: -1 };

        const [orders, total] = await Promise.all([
            Order.find(filter)
                .populate("user", "name email")
                .sort(sortOption)
                .skip(skip)
                .limit(limit),

            Order.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,

            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },

            orders,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSellerOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.seller._id;

        const order = await Order.findOne({
            _id: id,
            "items.seller": sellerId
        }).populate("user", "name email phone");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }

        res.status(200).json({
            success: true,
            order
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


const updateSellerOrderStatus = async (req, res) => {
    try {
        const sellerId = req.seller._id;
        const { id } = req.params;
        const { orderStatus } = req.body;
        
        const allowedStatus = [
            "processing",
            "shipped",
            "delivered"
        ];

        if (!allowedStatus.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            })
        }

        const order = await Order.findOne({
            _id: id,
            "items.seller": sellerId
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated sucessfully",
            order
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = {
    getSellerOrders,
    getSellerOrderById,
    updateSellerOrderStatus
};


// const Order = require("../../models/Order");

// const getSellerOrders = async (req, res) => {
//     try {
//         const sellerId = req.seller._id;

//         const page = Number(req.query.page) || 1;
//         const limit = Number(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const {
//             status,
//             sort = "latest",
//             from,
//             to,
//             search,
//         } = req.query;

//         const filter = {
//             "items.seller": sellerId,
//         };

//         // Order Status Filter
//         if (status) {
//             filter.orderStatus = status.toLowerCase();
//         }

//         // Date Range Filter
//         if (from || to) {
//             filter.createdAt = {};

//             if (from) {
//                 filter.createdAt.$gte = new Date(from);
//             }

//             if (to) {
//                 const endDate = new Date(to);
//                 endDate.setHours(23, 59, 59, 999);
//                 filter.createdAt.$lte = endDate;
//             }
//         }

//         const sortOption =
//             sort === "oldest"
//                 ? { createdAt: 1 }
//                 : { createdAt: -1 };

//         let orders = await Order.find(filter)
//             .populate("user", "name email")
//             .select(
//                 "user items pricing paymentInfo orderStatus createdAt"
//             )
//             .sort(sortOption)
//             .skip(skip)
//             .limit(limit);

//         // Search Customer
//         if (search) {
//             const keyword = search.toLowerCase();

//             orders = orders.filter((order) => {
//                 const user = order.user;

//                 return (
//                     user?.name?.toLowerCase().includes(keyword) ||
//                     user?.email?.toLowerCase().includes(keyword)
//                 );
//             });
//         }

//         const total = await Order.countDocuments(filter);

//         res.status(200).json({
//             success: true,

//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 pages: Math.ceil(total / limit),
//             },

//             filters: {
//                 status: status || null,
//                 sort,
//                 from: from || null,
//                 to: to || null,
//                 search: search || null,
//             },

//             orders,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// module.exports = {
//     getSellerOrders,
// };








// const Order = require("../../models/Order");

// const getSellerOrders = async (req, res) => {
//     try {
//         const sellerId = req.seller._id;

//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const orders = await Order.find({
//             "items.seller": sellerId
//         })
//             .populate("user", "name email")
//             .sort({ createdAt: -1 })
//             .skip((page - 1) * limit)
//             .limit(limit);

//         const total = await Order.countDocuments({
//             "items.seller": sellerId
//         });

//         res.json({
//             success: true,
//             total,
//             page,
//             pages: Math.ceil(total / limit),
//             orders
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// module.exports = { getSellerOrders };