const rateLimit = require("express-rate-limit");

const uploadLimiter = require({
    windowMs: 10 * 60 * 1000,
    max: 10, //10 uploads per 10 min per IP
    message: "To manny uploads, try again later"
});

module.exports = uploadLimiter;