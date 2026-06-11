const express = require("express");
const { sellerLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");
const { becomeSellerSchema } = require("../validators/seller.validator");
const { isSeller } = require("../middlewares/isSeller.middleware");
const { getSellerProducts, getSellerOrders, getSellerDashboard, becomeSeller } = require("../controllers/seller.controller");
const validate = require("../middlewares/validate.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const router = express.Router();

router.use(sellerLimiter);
router.post("/become",
    authMiddleware,
    validate(becomeSellerSchema, "body"),
    becomeSeller
);

router.get("/products",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerProducts
);

router.get("/orders",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerOrders
);

router.get("/dashboard",
    authMiddleware,
    isSeller,
    authorizeRoles("seller"),
    getSellerDashboard
);

module.exports = router;