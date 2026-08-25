const User = require("../../models/User");
const Seller = require("../../models/Seller");

const getAllUserAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserRoleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // User -> Seller
    if (role === "seller" && !user.sellerProfile) {
      const seller = await Seller.create({
        user: user._id,
        shopName: `${user.name}'s Shop`,
        gstNumber: null,
        status: "pending",
      });

      user.sellerProfile = seller._id;
    }

    // Seller -> User
    if (role === "user" && user.sellerProfile) {
      await Seller.findByIdAndDelete(user.sellerProfile);

      user.sellerProfile = null;
    }

    user.role = role;

    await user.save();

    res.json({
      success: true,
      message: "Role updated successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const blockUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isBlocked },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllUserAdmin,
  updateUserRoleAdmin,
  blockUserAdmin,
};
