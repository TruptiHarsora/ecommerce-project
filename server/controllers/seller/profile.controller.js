const User = require("../../models/User.js");
const Seller = require("../../models/Seller.js");

const becomeSeller = async (req, res) => {

    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const existing = await Seller.findOne({ user: userId });

        if (existing) {
            return res.json({
                success: false,
                message: "Already a seller"
            });
        }

        const { shopName, gstNumber } = req.body;

        if (!shopName) {
            return res.status(400).json({
                success: false,
                message: "Shop name required"
            });
        }

        const seller = await Seller.create({
            user: userId,
            shopName: shopName.trim(),
            gstNumber: gstNumber || null,
            status: "active"
        });

        // await User.findByIdAndUpdate(userId, { role: "seller" });
        user.role = "seller";
        user.sellerProfile = seller._id;
        await user.save();

        res.status(201).json({
            success: true,
            message: "Seller account created",
            seller
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSellerProfile = async (req, res) => {
    try {

        const seller = await Seller.findById(req.seller._id)
            .populate("user", "name email phone avtar isVerified");

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            seller
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateSellerProfile = async (req, res) => {
    try {

        const seller = await Seller.findById(req.seller._id);

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        const { shopName, gstNumber } = req.body;

        if (shopName !== undefined) {
            seller.shopName = shopName.trim();
        }

        if (gstNumber !== undefined) {
            seller.gstNumber = gstNumber.trim();
        }

        await seller.save();

        res.status(200).json({
            success: true,
            message: "Profile update sucessfully",
            seller
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { becomeSeller, getSellerProfile, updateSellerProfile };