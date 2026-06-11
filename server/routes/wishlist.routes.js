const express = require("express");
const router = express.Router();


const authMiddleware = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/validateRequest.middleware");

const {
    toggleWishlist,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
    moveWishlistToCart
} = require("../controllers/wishlist.controller");


const {
    toggleWishlistValidator,
    moveToCartValidator
} = require("../validators/wishlist.validator");
const validate = require("../middlewares/validate.middleware");


router.use(authMiddleware);

router.post("/", validate(toggleWishlistValidator, "body"), toggleWishlist);
router.get("/", getWishlist);
router.delete("/:productId/:variantSku", removeFromWishlist);
router.post("/move", validate(moveToCartValidator, "body"), moveWishlistToCart);
router.delete("/clear", clearWishlist);

// router.post(
//   "/move-all",
//   authMiddleware ,
//   moveAllToCart
// );

module.exports = router;