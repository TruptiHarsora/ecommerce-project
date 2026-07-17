const Product = require("../models/Product.js");
const Seller = require("../models/Seller.js");
const User = require("../models/User.js");
const Order = require("../models/Order");





// const getSellerProducts = async (req, res) => {
//     try {

//         const sellerId = req.seller._id;

//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;

//         const products = await Product.find({
//             "sellers.seller": sellerId
//         })
//             .skip((page - 1) * limit)
//             .limit(limit)
//             .sort({ createdAt: -1 })

//         const total = await Product.countDocuments({
//             "sellers.seller": sellerId
//         });

//         res.json({
//             success: true,
//             total,
//             page,
//             pages: Math.ceil(total / limit),
//             products
//         })


//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }







// module.exports = {
//     becomeSeller,
//     getSellerProducts,
//     getSellerOrders,
//     getSellerDashboard
// };


