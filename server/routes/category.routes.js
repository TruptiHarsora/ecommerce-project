const express = require("express");
const routes = express.Router();

const validateRequest = require("../middlewares/validateRequest.middleware");
const checkParentsExist = require("../middlewares/category.middleware");
const authMiddleware = require("../middlewares/auth.middleware.js");

const { createCategory, getAllCategory, getByIdCategory, updateCategory, deleteCategory } = require("../controllers/category.controller");
const { createCategorySchema, updateCategorySchema } = require("../validators/category.validator");
const authorizeRoles = require("../middlewares/role.middleware.js");
const validate = require("../middlewares/validate.middleware.js");


routes.post("/",
    authMiddleware,
    authorizeRoles("admin"),
    validate(createCategorySchema, "body"),
    checkParentsExist, createCategory);

routes.get("/", getAllCategory);
routes.get("/:id", getByIdCategory);

routes.put("/:id",
    authMiddleware,
    authorizeRoles("admin"),
    validate(updateCategorySchema, "body"),
    checkParentsExist, updateCategory)

routes.delete("/:id",
    authMiddleware, authorizeRoles("admin"),
    deleteCategory);

module.exports = routes;