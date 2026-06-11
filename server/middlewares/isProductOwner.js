const Product = require("../models/Product.js");

const isProductOwner = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        // ADMIN BYPASS
        if (req.user.role === "admin") {
            req.product = product;
            return next();
        }

        const sellerId = req.seller?._id?.toString();

        const isOwner = product.sellers?.some(
            s => s.seller.toString() === sellerId
        );

        if (!isOwner && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not your product"
            });
        }

        req.product = product;
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { isProductOwner };