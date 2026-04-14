const multer = require("multer");

// store in memory (required for Cloudinary upload)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image file allowed"), false);
    }
    cb(null, true);
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});

module.exports = upload;