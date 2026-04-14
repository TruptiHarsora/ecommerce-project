const express = require("express");
const { register, login, refreshTokenHandler, logout } = require("../controllers/auth.controller");
const Routes = express.Router();

Routes.post("/register", register);
Routes.post("/login", login);
Routes.post("/refresh", refreshTokenHandler);
Routes.post("/logout", logout);

module.exports = Routes;