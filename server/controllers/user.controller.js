const User = require("../models/User.js");

const getUserProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password -refreshToken");
        console.log("getUserprofile user: ", user);

        if (!user) {
            return res.status(404).jason({
                success: false,
                message: "User not found"
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            })
        }

        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "current password is incorrect"
            })
        }

        user.password = newPassword;
        user.passwordChangeAt = new Date();
        user.refreshToken = null;

        await user.save();
        res.clearCookie("refreshToken");

        return res.json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const allowedFields = ["name", "phone", "avatar"];

        const update = Object.fromEntries(
            allowedFields
                .map((key) => [key, req.body[key]])
                .filter(([, value]) => value !== undefined && value !== null && value !== "")
        )

        if (Object.keys(update).length === 0) {
            return res.status(400).json({
                success: false,
                message: "NO valid filed to update"
            })
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: update },
            { new: true, runValidators: true }
        ).select("-password");

        res.json({
            success: true,
            message: "profile update successfully",
            user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { getUserProfile, updateProfile, changePassword }