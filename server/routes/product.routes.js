const express = require("express");
const router = express.Router();



const validateRequest = require("../middlewares/validateRequest.middleware.js");
const validateQuery = require("../middlewares/validateQueryProduct.middleware.js");

const {
    createProductSchema,
    updateProductSchema,
    queryProductSchema,
} = require("../validators/product.validator.js");

const {
    createProduct,
    getAllProduct,
    updateProduct,
    getProductById,
    deleteProduct,
    getSellerProducts
} = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware.js");
const authorizeRoles = require("../middlewares/role.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const { isSeller } = require("../middlewares/isSeller.middleware.js");
const { isProductOwner } = require("../middlewares/isProductOwner.js");
const upload = require("../middlewares/upload.middleware.js");



router.get("/",
    validate(queryProductSchema, "query"),
    getAllProduct
);
router.get("/seller/my-products",
    authMiddleware, authorizeRoles("seller"), isSeller,
    getSellerProducts);
router.get("/:id", getProductById);

// router.post("/",
//     authMiddleware, isSeller, authorizeRoles("seller", "admin"),
//     createProduct
// );
router.post("/",
    authMiddleware, authorizeRoles("seller", "admin"), isSeller,
    upload.fields([
        { name: "images", maxCount: 10, },
        { name: "variantImages", maxCount: 50, },
    ]),
    createProduct
);

router.put("/:id",
    authMiddleware, authorizeRoles("seller", "admin"),
    isSeller, isProductOwner,
    upload.fields([
        { name: "images", maxCount: 10, },
        { name: "variantImages", maxCount: 50, },
    ]),

    // (req, res, next) => {
    //     console.log("BODY =>", req.body);
    //     console.log("FILES =>", req.files);
    //     next();
    // },
    // validate(updateProductSchema, "body"),
    updateProduct
);

// router.put(
//     "/:id",
//     authMiddleware,
//     authorizeRoles("seller", "admin"),
//     isSeller,
//     isProductOwner,
//     upload.fields([
//         { name: "images", maxCount: 10 },
//         { name: "variantImages", maxCount: 50 },
//     ]),
//     updateProduct
// );

router.delete("/:id",
    authMiddleware, authorizeRoles("seller", "admin"),
    isSeller,
    isProductOwner,
    deleteProduct
);



module.exports = router;