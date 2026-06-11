const User = require("../../models/User.js");
const { safePick } = require("../../utils/safeUpdate.js");

const getAllUserAdmin = async (req, res) => {
    try {
        const users = await User.find().selet("-password");

        res.json({
            success: true,
            users
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUserRoleAdmin = async (req, res) => {
    try {

        const { id } = req.params;
        const allowedUpdate = safePick(req.body, ["role"]);

        const user = await User.findByIdAndUpdate(
            id,
            allowedUpdate,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        res.json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const blockUserAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const allowedUpdate = safePick(req.body, ["isBlocked"]);

        const user = await User.findByIdAndUpdate(
            id,
            allowedUpdate,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "user not found" });
        }

        res.json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAllUserAdmin, updateUserRoleAdmin, blockUserAdmin };