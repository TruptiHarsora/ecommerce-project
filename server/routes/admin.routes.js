const express = require("express");
const router = express.Router();

const AuthMiddle_User = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.post(
  "/dashboard",
  AuthMiddle_User,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);

module.exports = router;
