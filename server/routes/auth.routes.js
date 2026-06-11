const express = require("express");
const { register, login, refreshTokenHandler, logout } = require("../controllers/auth.controller");
const { authLimiter } = require("../middlewares/rateLimiter");
const validateRequest = require("../middlewares/validateRequest.middleware");
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require("../validators/user.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const Routes = express.Router();


Routes.post("/register",
    authLimiter,
    validate(registerSchema, "body"),
    register
);

Routes.post("/login",
    authLimiter,
    validate(loginSchema, "body"),
    login
);

Routes.post("/refresh-token", refreshTokenHandler);
Routes.post("/logout", authMiddleware, logout);

// Routes.put("/change-password",
//     authMiddleware,
//     validate(changePasswordSchema, "body"),
//     changePassword
// );

// Routes.put(
//     "/profile",
//     authMiddleware,
//     validate(updateProfileSchema, "body"),
//     updateProfile
// );



module.exports = Routes;