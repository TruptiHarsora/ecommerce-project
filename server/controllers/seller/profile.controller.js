const User = require("../../models/User");
const Seller = require("../../models/Seller");
const compressImage = require("../../utils/compressImage");
const uploadToCloudinary = require("../../utils/uploadToCloudinary");

const becomeSeller = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existingSeller = await Seller.findOne({ user: userId });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "You are already a seller",
      });
    }
    // console.log(req.body);
    const { shopName, gstNumber, businessPhone, pickupAddress } = req.body;

    let logo = "";

    if (req.file) {
      const compressed = await compressImage(req.file.buffer);
      const uploaded = await uploadToCloudinary(compressed);

      logo = uploaded.secure_url;
    }

    const seller = await Seller.create({
      user: userId,
      shopName: shopName.trim(),
      gstNumber: gstNumber?.trim() || "",
      businessPhone: businessPhone?.trim() || "",
      pickupAddress,
      logo,
      status: "active",
    });

    user.role = "seller";
    user.sellerProfile = seller._id;

    await user.save();
    // console.log("Seller", user);
    const populatedSeller = await Seller.findById(seller._id).populate(
      "user",
      "name email phone avatar",
    );

    return res.status(201).json({
      success: true,
      message: "Seller account created successfully",
      seller: populatedSeller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { becomeSeller, getSellerProfile, updateSellerProfile };
