const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const validate = require("../middlewares/validate.middleware.js");

// validators

const { getDashboard } = require("../controllers/admin/dashboard.controller.js");
const { getAllUserAdmin, updateUserRoleAdmin, blockUserAdmin } = require("../controllers/admin/user.controller.js");
const { getAllOrdersAdmin } = require("../controllers/admin/order.controller.js");
const { getAllProductsAdmin } = require("../controllers/admin/product.controller.js");
const { getAllCategoriesAdmin } = require("../controllers/admin/category.controller.js");
const { getAllReviewsAdmin, deleteReviewAdmin } = require("../controllers/admin/review.controller.js");
const { mongoIdSchema, updateUserRoleSchema, blockUserSchema, orderQuerySchema } = require("../validators/admin.validator.js");


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
router.get(
    "/orders",
    validate(orderQuerySchema, "query"),
    getAllOrdersAdmin
);


//products
router.get("/products", getAllProductsAdmin);


//category
router.get("/categories", getAllCategoriesAdmin);

//reviews

router.get("/reviews", getAllReviewsAdmin);
router.delete("/reviews/:id", validate(mongoIdSchema, "params"), deleteReviewAdmin);

module.exports = router;



// router.get("/dashboard", (req, res) => {
//   res.json({ message: "Welcome Admin" });
// });

// module.exports = router;
