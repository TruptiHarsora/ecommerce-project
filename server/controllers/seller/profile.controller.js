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

// const becomeSeller = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const existing = await Seller.findOne({ user: userId });

//     if (existing) {
//       return res.status(400).json({
//         success: false,
//         message: "Already a seller",
//       });
//     }

//     const { shopName, gstNumber } = req.body;

//     if (!shopName) {
//       return res.status(400).json({
//         success: false,
//         message: "Shop name required",
//       });
//     }

//     const seller = await Seller.create({
//       user: userId,
//       shopName: shopName.trim(),
//       gstNumber: gstNumber || null,
//       status: "active",
//     });

//     // await User.findByIdAndUpdate(userId, { role: "seller" });
//     user.role = "seller";
//     user.sellerProfile = seller._id;
//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "Seller account created",
//       seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id).populate(
      "user",
      "name email phone avatar isVerified",
    );
    // console.log("getProfile Seller", seller);
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    Object.assign(seller, req.body);
    // const { shopName, gstNumber, businessPhone, pickupAddress } = req.body;

    // if (shopName !== undefined) {
    //   seller.shopName = shopName.trim();
    // }

    // if (gstNumber !== undefined) {
    //   seller.gstNumber = gstNumber.trim();
    // }

    // if (businessPhone !== undefined) {
    //   seller.businessPhone = businessPhone;
    // }

    // if (pickupAddress !== undefined) {
    //   seller.pickupAddress = pickupAddress;
    // }

    // Upload Logo
    if (req.file) {
      const compressed = await compressImage(req.file.buffer);
      const uploaded = await uploadToCloudinary(compressed);

      seller.logo = uploaded.secure_url;
    }

    // const allowedFields = [
    //   "shopName",
    //   "gstNumber",
    //   "businessPhone",
    //   "pickupAddress",
    //   "logo",
    // ];

    // allowedFields.forEach((field) => {
    //   if (req.body[field] !== undefined) {
    //     seller[field] = req.body[field];
    //   }
    // });

    // await seller.save();

    await seller.save();

    const updatedSeller = await Seller.findById(seller._id).populate(
      "user",
      "name email phone avatar",
    );

    res.status(200).json({
      success: true,
      message: "Seller profile updated successfully",
      seller: updatedSeller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// const updateSellerProfile = async (req, res) => {
//   try {
//     const seller = await Seller.findById(req.seller._id);

//     if (!seller) {
//       return res.status(404).json({
//         success: false,
//         message: "Seller not found",
//       });
//     }

//     const { shopName, gstNumber } = req.body;

//     if (shopName !== undefined) {
//       seller.shopName = shopName.trim();
//     }

//     if (gstNumber !== undefined) {
//       seller.gstNumber = gstNumber.trim();
//     }

//     await seller.save();

//     res.status(200).json({
//       success: true,
//       message: "Profile update sucessfully",
//       seller,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

module.exports = { becomeSeller, getSellerProfile, updateSellerProfile };
