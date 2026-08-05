const express = require("express");
const Routes = express.Router();

const {
  updateProfileSchema,
  changePasswordSchema,
} = require("../validators/user.validator");

const validateRequest = require("../middlewares/validateRequest.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const upload = require("../middlewares/upload.middleware.js");

const {
  changePassword,
  updateProfile,
  getUserProfile,
} = require("../controllers/user.controller");

Routes.use(authMiddleware);

Routes.get("/profile", getUserProfile);

Routes.patch(
  "/change-password",
  validate(changePasswordSchema, "body"),
  changePassword,
);

Routes.patch(
  "/profile",
  upload.single("avatar"),
  validate(updateProfileSchema, "body"),
  updateProfile,
);

module.exports = Routes;
