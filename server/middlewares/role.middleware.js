const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("req.user ", req.user);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) not allowed`
        // message: "Forbidden: Access denied"
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
