const User = require("../models/User.js");
const compressImage = require("../utils/compressImage");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken",
    );
    // console.log("getUserprofile user: ", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "current password is incorrect",
      });
    }

    user.password = newPassword;
    user.passwordChangeAt = new Date();
    user.refreshToken = null;

    await user.save();
    res.clearCookie("refreshToken");

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update text fields
    Object.assign(user, req.body);

    // Upload Avatar
    if (req.file) {
      const compressed = await compressImage(req.file.buffer);
      const uploaded = await uploadToCloudinary(compressed);

      user.avatar = uploaded.secure_url;
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getUserProfile, updateProfile, changePassword };
