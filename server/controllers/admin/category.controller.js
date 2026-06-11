const Category = require("../../models/Category.js");

const getAllCategoriesAdmin = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate("parent", "name");

        res.json({
            success: true,
            categories
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getAllCategoriesAdmin };