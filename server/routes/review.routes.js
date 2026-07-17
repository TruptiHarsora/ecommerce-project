const express = require("express");
const router = express.Router();

const {
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    getProductReviews,
    getMyReview
} = require("../controllers/review.controller.js");

const authMiddleware = require("../middlewares/auth.middleware.js");
const validateRequest = require("../middlewares/validateRequest.middleware.js");
const {
    reviewCreateSchema,
    reviewUpdateSchema,
    helpfulSchema
} = require("../validators/review.validator.js");

const { reviewLimiter } = require("../middlewares/rateLimiter.js");
const checkReviewOwnerOrAdmin = require("../middlewares/checkReviewOwnerOrAdmin.middleware.js");
const validate = require("../middlewares/validate.middleware.js");
const upload = require("../middlewares/upload.middleware.js");

// router.use(authMiddleware);

router.post("/:productId",authMiddleware,
    reviewLimiter,
    upload.array("images", 5),
    validate(reviewCreateSchema, "body"),
    createReview
);

router.put("/:id",authMiddleware,
    checkReviewOwnerOrAdmin,
    upload.array("images", 5),
    validate(reviewUpdateSchema, "body"),
    updateReview
);


router.delete("/:id",authMiddleware,
    checkReviewOwnerOrAdmin,
    deleteReview
);

router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/me",authMiddleware,getMyReview);

router.patch("/:id/helpful",authMiddleware,
    validate(helpfulSchema, "body"),
    markHelpful
);


module.exports = router;