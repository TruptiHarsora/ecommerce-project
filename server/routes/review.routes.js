const express = require("express");
const router = express.Router();

const {
    createReview,
    updateReview,
    deleteReview,
    markHelpful
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

router.use(authMiddleware);

router.post("/:productId",
    reviewLimiter,
    validate(reviewCreateSchema,"body"),
    createReview
);


router.put("/:id",
    checkReviewOwnerOrAdmin,
    validate(reviewUpdateSchema,"body"),
    updateReview
);


router.delete("/:id",
    checkReviewOwnerOrAdmin,
    deleteReview
);


router.patch("/:id/helpful",
    validate(helpfulSchema,"body"),
    markHelpful
);


module.exports = router;