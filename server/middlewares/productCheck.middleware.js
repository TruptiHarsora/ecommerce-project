const mongoose = require("mongoose");
const Product = require("../models/Product.js");

const productCheckMiddleware = async (req, res, next) => {

    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
        return res.status(401).json({
            success: false,
            message: "Product not found"
        });
    }

    req.product = product;
    next();


}