const express = require("express");
const router = express.Router();

// const authMiddleware = require("../middlewares/auth.middleware.js");
const validateRequest = require("../middlewares/validateRequest.middleware");
const authorizeRoles = require("../middlewares/role.middleware.js");
const {
    createOrder,
    confirmOrder,
    removeOrder,
    updateOrderStatus,
    getUserOrders,
    getOrderById
} = require("../controllers/order.controller");

const {
    createOrderValidator,
    updateOrderStatusValidator
} = require("../validators/order.validator");
const authMiddleware = require("../middlewares/auth.middleware.js");
const validate = require("../middlewares/validate.middleware.js");

router.use(authMiddleware);

router.post("/", validate(createOrderValidator,"body"), createOrder);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.patch("/:id/cancel", removeOrder);

router.patch("/:id/confirm", authorizeRoles("admin"), confirmOrder);
router.patch("/:id/status", authorizeRoles("admin"),
    validate(updateOrderStatusValidator, "body"), updateOrderStatus);



module.exports = router;