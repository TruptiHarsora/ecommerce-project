const express = require("express");
const { sellerLimiter } = require("../middlewares/rateLimiter");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  becomeSellerSchema,
  updateSellerProfileSchema,
} = require("../validators/seller.validator");
const { isSeller } = require("../middlewares/isSeller.middleware");
const validate = require("../middlewares/validate.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const { getSellerReviews } = require("../controllers/seller/review.controller");
const {
  becomeSeller,
  updateSellerProfile,
  getSellerProfile,
} = require("../controllers/seller/profile.controller");
const {
  getSellerProducts,
  toggleProductStatus,
} = require("../controllers/product.controller");
const {
  getSellerOrders,
  getSellerOrderById,
  updateSellerOrderStatus,
} = require("../controllers/seller/order.controller");
const {
  getSellerDashboard,
} = require("../controllers/seller/dashboard.controller");
const { mongoIdSchema } = require("../validators/admin.validator");
const parseBody = require("../middlewares/parseBody.middleware");
const router = express.Router();

router.use(sellerLimiter);
// router.use(authMiddleware);
//seller profile
router.post(
  "/become",
  authMiddleware,
  upload.single("logo"),
  parseBody(["pickupAddress"]),
  validate(becomeSellerSchema, "body"),
  becomeSeller,
);
router.get(
  "/profile",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  getSellerProfile,
);

// router.patch(
//   "/profile",
//   authMiddleware,
//   isSeller,
//   authorizeRoles("seller"),
//   updateSellerProfile,
// );

router.patch(
  "/profile",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  upload.single("logo"),
  parseBody(["pickupAddress"]),
  validate(updateSellerProfileSchema, "body"),
  updateSellerProfile,
);

//seller Products
router.get(
  "/products",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  getSellerProducts,
);
router.patch(
  "/product/:id/status",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  validate(mongoIdSchema, "params"),
  toggleProductStatus,
);

//seller orders
router.get(
  "/orders",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  getSellerOrders,
);
router.get(
  "/orders/:id",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  validate(mongoIdSchema, "params"),
  getSellerOrderById,
);
router.patch(
  "/orders/:id/status",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  validate(mongoIdSchema, "params"),
  updateSellerOrderStatus,
);

//seller dashboard
router.get(
  "/dashboard",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  getSellerDashboard,
);

//seller reviews
router.get(
  "/reviews",
  authMiddleware,
  isSeller,
  authorizeRoles("seller"),
  getSellerReviews,
);

module.exports = router;
