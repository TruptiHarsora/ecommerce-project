const Seller = require("../models/Seller.js");

const isSeller = async (req, res, next) => {
    try {
        // ADMIN BYPASS
        if (req.user.role === "admin") {
            return next();
        }


        const userId = req.user?.id;

        // if (!userId) {
        //     return res.status(401).json({
        //         success: false,
        //         message: "Unauthorized"
        //     });
        // }

        // // Check user
        // const user = await User.findById(userId);

        // if (!user || user.role !== "seller") {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Seller access required"
        //     });
        // }




        //check seller
        const seller = await Seller.findOne({ user: userId });
        if (!seller) {
            return res.status(403).json({
                success: false,
                message: "Seller profile not found"
            });
        }


        // if (!seller.isVerified) {
        //     return res.status(403).json({
        //         success: false,
        //         message: "Seller not verified yet"
        //     });
        // }

        if (seller.status !== "active") {
            return res.status(403).json({
                success: false,
                message: "Seller not active"
            });
        }
        console.log("seller", seller);
        req.seller = seller;
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { isSeller };