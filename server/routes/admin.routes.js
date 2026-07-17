const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware.js");

// validators

const { getDashboard } = require("../controllers/admin/dashboard.controller.js");
const { getAllUserAdmin, updateUserRoleAdmin, blockUserAdmin } = require("../controllers/admin/user.controller.js");
const { getAllOrdersAdmin, updateOrderStatusAdmin } = require("../controllers/admin/order.controller.js");
// const { getAllProductsAdmin } = require("../controllers/admin/product.controller.js");
const { getAllCategoriesAdmin } = require("../controllers/admin/category.controller.js");
const { getAllReviewsAdmin, deleteReviewAdmin } = require("../controllers/admin/review.controller.js");
const { mongoIdSchema, updateUserRoleSchema, blockUserSchema, orderQuerySchema, updateSellerStatusSchema } = require("../validators/admin.validator.js");
const { getAllSellersAdmin, verifySellerAdmin, updateSellerStatusAdmin, getSellerDetailsAdmin } = require("../controllers/admin/seller.controller.js");
const { getAllProductsAdmin, toggleProductStatus } = require("../controllers/product.controller.js");


// router.post(
//   "/dashboard",
//   authMiddleware ,
//   authorizeRoles("admin"),
//   (req, res) => {
//     res.json({ message: "Welcome Admin" });
//   }
// );


router.use(authMiddleware);
router.use(authorizeRoles("admin"));

//dashbord
router.get("/dashboard", getDashboard);


//users
router.get("/users", getAllUserAdmin);

router.patch(
    "/users/:id/role",
    validate(mongoIdSchema, "params"),
    validate(updateUserRoleSchema, "body"),
    updateUserRoleAdmin
);

router.patch(
    "/users/:id/block",
    validate(mongoIdSchema, "params"),
    validate(blockUserSchema, "body"),
    blockUserAdmin
);


//orders
router.get("/orders",
    validate(orderQuerySchema, "query"),
    getAllOrdersAdmin
);

router.patch("/orders/:id/status",
    updateOrderStatusAdmin
);

//products
router.get("/products", getAllProductsAdmin);
router.patch("/product/:id/status", toggleProductStatus);

//category
router.get("/categories", getAllCategoriesAdmin);

//reviews

router.get("/reviews", getAllReviewsAdmin);
router.delete("/reviews/:id", validate(mongoIdSchema, "params"), deleteReviewAdmin);


//sellers
router.get("/sellers", getAllSellersAdmin);
router.get("/sellers/:id", validate(mongoIdSchema), getSellerDetailsAdmin);
router.patch("/sellers/:id/verify", validate(mongoIdSchema, "params"), verifySellerAdmin);
router.patch("/sellers/:id/status",
    validate(mongoIdSchema, "params"),
    validate(updateSellerStatusSchema, "body"),
    updateSellerStatusAdmin);



module.exports = router;



// router.get("/dashboard", (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// module.exports = router;
