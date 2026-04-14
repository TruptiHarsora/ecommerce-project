const cloudinary = require("cloudinary");

const deleteFromCloudinary = async (imgUrl) => {
    const publicId = imgUrl.split("/").pop().split(".")[0];
    await cloudinary.UploadStream.destroy(`product/${publicId}`);
}

module.exports = deleteFromCloudinary