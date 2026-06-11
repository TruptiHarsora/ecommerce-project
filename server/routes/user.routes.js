const express = require("express");
const Routes = express.Router();


const { updateProfileSchema, changePasswordSchema } = require("../validators/user.validator");

const validateRequest = require("../middlewares/validateRequest.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { changePassword, updateProfile, getUserProfile } = require("../controllers/user.controller");

Routes.use(authMiddleware);

Routes.get("/profile", authMiddleware, getUserProfile);

Routes.put("/change-password",
    authMiddleware,
    validate(changePasswordSchema, "body"),
    changePassword
);

Routes.put(
    "/updateProfile",
    authMiddleware,
    validate(updateProfileSchema, "body"),
    updateProfile
);

module.exports = Routes;