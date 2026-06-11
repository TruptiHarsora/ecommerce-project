const rateLimit = require("express-rate-limit");

const createLimiter = ({ windowMs, max, message }) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message,
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};


const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10, // login/signup protection
    message: "Too many attempts, try later"
});

const uploadLimiter = createLimiter({
    windowMs: 10 * 60 * 1000,
    max: 10, //10 uploads per 10 min per IP
    message: "To manny uploads, try again later"
});


const reviewLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many review requests, try later"
});

const sellerLimiter = createLimiter({
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many requests, try again later"
});
module.exports = { authLimiter, uploadLimiter, reviewLimiter, sellerLimiter };