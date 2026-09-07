const sharp = require("sharp");

const compressImage = async (buffer) => {
  return await sharp(buffer)
    // .resize(12000)
    // .jpeg({ quality: 70 })
    .resize({
      width: 1200,
      height: 1200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 70,
      progressive: true,
    })
    .toBuffer();
};

module.exports = compressImage;
