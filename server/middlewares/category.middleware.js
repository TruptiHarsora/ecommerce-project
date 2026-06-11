const mongoose = require("mongoose");
const Category = require("../models/Category.js");

const checkParentsExist = async (req, res, next) => {
    try {
        const { parent } = req.body;
        console.log("parent id", parent);

        if (!parent) return next();

        if (!mongoose.Types.ObjectId.isValid(parent)) {
            return res.status(400).json({
                success: false, message: "invalid parent category ID"
            })
        }

        const exist = await Category.findById(parent);

        if (!exist) {
            return res.satus(400).json({
                success: false,
                message: "parent category not found"
            })
        }
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = checkParentsExist

