const Category = require("../models/Category.js");
const mongoose = require("mongoose");
const checkCircularParent = require("../utils/category.js");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const createCategory = async (req, res) => {
    try {
        const { name, parent, isActive } = req.body;

        const category = await Category.create({
            name,
            parent: parent || null,
            isActive: isActive ?? true
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find().populate("parent", "name").lean();

        res.status(200).json({
            success: true,
            message: "All category",
            count: categories.length,
            categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getByIdCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category Id"
            });
        }

        const category = await Category.findById(id).populate("parent", "name").lean();

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.json({
            success: true,
            category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, parent, isActive } = req.body;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ID"
            });
        }
        if (parent && parent === id) {
            return res.status(400).json({
                success: false,
                message: "Category cannot be parent of itself"
            });
        }

        if (parent) {
            const isCircular = await checkCircularParent(id, parent);

            if (isCircular) {
                return res.status(400).json({
                    success: false,
                    message: "Circular parent relationship detected"
                })
            }
        }

        const category = await Category.findByIdAndUpdate(
            id,
            {
                ...(name && { name }),
                ...(parent !== undefined && { parent: parent || null }),
                ...(isActive !== undefined && { isActive })
            },
            { new: true, runValidators: true }
        ).lean();

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }

        res.json({
            success: true,
            message: "category update sucessfully",
            category
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID"
            })
        }

        const hasChild = await Category.findOne({ parent: id });

        if (hasChild) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category with child categories"
            });
        }

        await Category.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Category delete successfully"
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



module.exports = {
    createCategory,
    getAllCategory,
    getByIdCategory,
    updateCategory,
    deleteCategory
}