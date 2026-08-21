const requireVerifiedSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res.status(403).json({
      success: false,
      message: "Seller access required",
    });
  }

  if (req.user.isVerified !== true) {
    return res.status(403).json({
      success: false,
      message: "Your seller account is not verified yet",
    });
  }

  next();
};

module.exports = requireVerifiedSeller;
