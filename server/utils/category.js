const Category = require("../models/Category.js");

const checkCircularParent = async (categoryId, parentId) => {
    let current = parentId;

    while (current) {
        if (current.toString() === categoryId.toString()) {
            return true;
        }
        const parent = await Category.findById(current).select("parent");
        current = parent?.parent;
    }
    return false;
}

module.exports = checkCircularParent;