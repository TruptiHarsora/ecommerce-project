const Category = require("../../models/Category.js");

const getAllCategoriesAdmin = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const categories = await Category.find({ isActive: true })
            .populate("parent", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCategories = await Category.countDocuments({
            isActive: true
        });

        res.status(200).json({
            success: true,
            categories,
            totalCategories,
            page,
            totalPages: Math.ceil(totalCategories / limit)
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { getAllCategoriesAdmin };




// const Category = require("../../models/Category.js");

// const getAllCategoriesAdmin = async (req, res) => {
//     try {
//         const categories = await Category.find({ isActive: true })
//             .populate("parent", "name");

//         res.json({
//             success: true,
//             categories
//         })
//     } catch (error) {
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// module.exports = { getAllCategoriesAdmin };