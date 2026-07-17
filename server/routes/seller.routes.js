const express = require("express");
const { sellerLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");
const { becomeSellerSchema } = require("../validators/seller.validator");
const { isSeller } = require("../middlewares/isSeller.middleware");
const validate = require("../middlewares/validate.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const { getSellerReviews } = require("../controllers/seller/review.controller");
const { becomeSeller, updateSellerProfile, getSellerProfile } = require("../controllers/seller/profile.controller");
const { getSellerProducts, toggleProductStatus } = require("../controllers/product.controller");
const { getSellerOrders } = require("../controllers/seller/order.controller");
const { getSellerDashboard } = require("../controllers/seller/dashboard.controller");
const router = express.Router();

router.use(sellerLimiter);
//seller profile
router.post("/become",
    authMiddleware,
    validate(becomeSellerSchema, "body"),
    becomeSeller
);
router.get(
    "/profile",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerProfile
);

router.patch(
    "/profile",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    updateSellerProfile
);

//seller Products
router.get("/products",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerProducts
);
router.patch("/product/:id/status",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    toggleProductStatus);

//seller orders
router.get("/orders",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerOrders
);

//seller dashboard
router.get("/dashboard",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerDashboard
);


//seller reviews
router.get("/reviews",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerReviews
);

module.exports = router;