const express = require("express");
const app = express();
const cors = require("cors");
const { FRONTEND_ORIGIN } = require("../config/config.js");
const cookieParser = require("cookie-parser");
const authRoutes = require("../routes/auth.routes.js");
const adminRoutes = require("../routes/admin.routes.js");

app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin",adminRoutes);


// // Error middleware
// app.use(require("./middlewares/errorMiddleware"));

// app.use((err, req, res, next) => res.status(err.status || 500).json({ message: err.message || "Server Error" }));

app.get("/", (req, res) => {
    res.json("Default page");
})

module.exports = app;