const express = require("express");
const validateRequest = require("../middlewares/validateRequest.middleware");
const authMiddleware = require("../middlewares/auth.middleware.js");
const {
    addToCart,
    getCart,
    updateCart,
    removeCart
} = require("../controllers/cart.controller");
const {
    addToCartSchema,
    updateCartSchema
} = require("../validators/cart.validator");
const validate = require("../middlewares/validate.middleware.js");
const routes = express.Router();

// routes.post("/items", authMiddleware, validateRequest(addToCartSchema), addToCart);
// routes.get("/", authMiddleware, getCart);
// routes.put("/items/:itemId", authMiddleware, validateRequest(updateCartSchema), updateCart);
// routes.delete("/items/:itemId", authMiddleware, removeCart);
routes.use(authMiddleware);

routes.get("/", getCart);

routes.post("/items",
    validate(addToCartSchema, "body"),
    addToCart
);


routes.put("/items/:itemId",
    validate(updateCartSchema, "body"),
    updateCart
);

routes.delete("/items/:itemId", removeCart);

module.exports = routes;