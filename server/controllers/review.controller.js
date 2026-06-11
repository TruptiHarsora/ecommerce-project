const mongoose = require("mongoose");
const Review = require("../models/Review.js");
const Product = require("../models/Product.js");
const { checkVerifiedPurchases } = require("../utils/checkVerifiedPurchase.js");

const createReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { productId } = req.params;
        const { rating, title, comment } = req.body
        const numRating = Number(rating);
        if (!numRating || numRating < 1 || numRating > 5) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }
        const product = await Product.findById(productId).session(session);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const existingReview = await Review.findOne({
            user: req.user.id,
            product: productId,
            isDeleted: false
        }).session(session);

        if (existingReview) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                success: false,
                message: "You already reviewed this product"
            });
        }

        const isVerified = await checkVerifiedPurchases(req.user.id, productId);


        const review = await Review.create([{
            user: req.user.id,
            product: productId,
            rating: numRating,
            title,
            comment,
            isVerifiedPurchase: isVerified
        }], { session });


        product.ratingSum = (product.ratingSum || 0) + numRating;
        product.ratingCount = (product.ratingCount || 0) + 1;
        product.ratingAverage = product.ratingCount === 0
            ? 0
            : Number((product.ratingSum / product.ratingCount).toFixed(1));


        // product.ratingAverage = product.ratingSum / product.ratingCount;
        // product.ratingAverage =
        //     product.ratingCount === 0 ? 0
        //         : product.ratingSum / product.ratingCount;

        await product.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(review[0]);


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate review not allowed"
            });
        }

        res.status(500).json({ message: error.message });
    }
}

const updateReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const review = await Review.findById(req.params.id).session(session);

        if (!review || review.isDeleted) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "review not found"
            })
        }

        if (review.user.toString() !== req.user.id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            })
        }

        const product = await Product.findById(review.product).session(session);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        const oldRating = review.rating;

        if (req.body.rating !== undefined
            && (Number(req.body.rating) < 1 || Number(req.body.rating) > 5)) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: "Rating must be between 1 and 5"
            });
        }

        review.rating = req.body.rating !== undefined
            ? Number(req.body.rating)
            : review.rating;
        review.title = req.body.title ?? review.title;
        review.comment = req.body.comment ?? review.comment;

        await review.save({ session });

        // product.ratingSum = (product.ratingSum || 0) - oldRating + review.rating;
        product.ratingSum -= oldRating;
        product.ratingSum += review.rating;
        product.ratingAverage = product.ratingCount === 0
            ? 0 : Number((product.ratingSum / product.ratingCount).toFixed(1));

        await product.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.json({
            success: true,
            review
        })


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}


const deleteReview = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const review = await Review.findById(req.params.id).session(session);

        if (!review || review.isDeleted) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "review not found"
            })
        }

        if (review.user.toString() !== req.user.id.toString()) {
            await session.abortTransaction();
            session.endSession();
            return res.status(403).json({
                success: false,
                message: "Not allowed"
            })
        }

        const product = await Product.findById(review.product).session(session);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        review.isDeleted = true;
        await review.save({ session });

        product.ratingCount -= 1;
        product.ratingSum -= review.rating;

        if (product.ratingCount <= 0) {
            product.ratingCount = 0;
            product.ratingSum = 0;
        }

        // product.ratingCount = Math.max(0, (product.ratingCount || 0) - 1);
        // product.ratingSum = Math.max(0, (product.ratingSum || 0) - review.rating);

        product.ratingAverage =
            product.ratingCount === 0
                ? 0
                : Number((product.ratingSum / product.ratingCount).toFixed(1));

        await product.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ success: true, message: "Review deleted" });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: error.message });
    }
}

const markHelpful = async (req, res) => {
    try {
        // const review = await Review.findById(req.params.id);

        // if (!review || review.isDeleted) {
        //     return res.status(404).json({ message: "Review not found" });
        // }

        // const userId = req.user.id;

        // review.helpfulUsers = review.helpfulUsers || [];

        // if (review.helpfulUsers.includes(userId)) {
        //     return res.status(400).json({ message: "Already voted" });
        // }

        // review.helpfulUsers.push(userId);
        // review.helpfulCount = (review.helpfulCount || 0) + 1;
        // await review.save();

        const userId = req.user.id;

        const updated = await Review.findOneAndUpdate(
            {
                _id: req.params.id,
                helpfulUsers: { $ne: userId }, // user hasn't voted yet
                isDeleted: false
            },
            {
                $addToSet: { helpfulUsers: userId },
                $inc: { helpfulCount: 1 }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json({
                message: "Already voted or review not found"
            });
        }
        res.json({ success: true });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, updateReview, deleteReview, markHelpful };