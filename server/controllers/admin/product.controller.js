const Product = require("../../models/Product.js");

const getAllProductsAdmin = async (req, res) => {
    try {

        let page = Number(req.params.page) || 1;
        let limit = Number(req.params.limit) || 20;

        if (limit > 50) limit = 50;

        const skip = (page - 1) * limit;

        const products = await Product.find({ isActive: true })
            .populate("category", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            success: true,
            products
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllProductsAdmin };
