// const Product = require("../../models/Product");

// const getAllProductsAdmin = async (req, res) => {
//     try {
//         const page = Number(req.query.page) || 1;
//         const limit = Number(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const products = await Product.find()
//             .populate("category", "name")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const totalProducts = await Product.countDocuments();

//         res.json({
//             success: true,
//             products,
//             totalProducts,
//             page,
//             totalPages: Math.ceil(totalProducts / limit)
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

// const toggleProductStatusAdmin = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { isActive } = req.body;

//         const product = await Product.findByIdAndUpdate(
//             id,
//             { isActive },
//             { new: true }
//         );

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Product not found",
//             });
//         }

//         res.json({
//             success: true,
//             product,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

// module.exports = {
//     getAllProductsAdmin,
//     toggleProductStatusAdmin,
// };





// const Product = require("../../models/Product.js");

// const getAllProductsAdmin = async (req, res) => {
//     try {

//         let page = Number(req.params.page) || 1;
//         let limit = Number(req.params.limit) || 20;

//         if (limit > 50) limit = 50;

//         const skip = (page - 1) * limit;

//         const products = await Product.find({ isActive: true })
//             .populate("category", "name")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         res.json({
//             success: true,
//             products
//         })
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// module.exports = { getAllProductsAdmin };
