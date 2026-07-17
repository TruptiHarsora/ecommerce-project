const express = require("express");
const app = express();
const cors = require("cors");

// const helmet = require("helmet");
// const mongoSanitize = require("express-mongo-sanitize");
// const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const { FRONTEND_ORIGIN } = require("../config/config.js");
const cookieParser = require("cookie-parser");

const authRoutes = require("../routes/auth.routes.js");
const adminRoutes = require("../routes/admin.routes.js");
const productRoutes = require("../routes/product.routes.js");
const categoryRoutes = require("../routes/category.routes.js");
const cartRoutes = require("../routes/cart.routes.js");
const orderRoutes = require("../routes/order.routes.js");
const wishlistRoutes = require("../routes/wishlist.routes.js");
const reviewRoutes = require("../routes/review.routes.js");
const userRoutes = require("../routes/user.routes.js");
const sellerRoutes = require("../routes/seller.routes.js");

const { authLimiter } = require("../middlewares/rateLimiter.js");
const AuthMiddle_User = require("../middlewares/auth.middleware.js");
const authorizeRoles = require("../middlewares/role.middleware.js");

require("../models/Product");
require("../models/Category.js");
require("../models/Cart.js");
require("../models/Order.js");
require("../models/Wishlist.js");
require("../models/Review.js");

app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet()); //Helmet (headers security)
// app.use(mongoSanitize()); //. Mongo injection protection
// app.use(xss()); //XSS protection

// app.use(rateLimit({ //Rate limiting
//     windowMs: 15 * 60 * 1000,
//     max: 100
// }));

// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 10, // login/signup protection
//     message: "Too many attempts, try later"
// });

// Routes
// app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/admin", AuthMiddle_User, authorizeRoles("admin"), adminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/seller", sellerRoutes);

// // Error middleware
// app.use(require("./middlewares/errorMiddleware"));

// app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || "Server Error" }));

app.get("/", (req, res) => {
    res.json("Default page");
})

module.exports = app;