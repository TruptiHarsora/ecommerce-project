const sharp = require("sharp");

const compressImage = async (buffer) => {
    return await sharp(buffer)
        .resize(12000)
        .jpeg({ quality: 70 })
        .toBuffer();
};

module.exports = compressImage;