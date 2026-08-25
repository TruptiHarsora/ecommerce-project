const JWT = require("jsonwebtoken");
const { JWT_ACCESS_SECRET } = require("../config/config");
const User = require("../models/User");

// const Auth_User = async (req, res, next) => {
//     try {
//         const AuthHeader = req.headers.authorization;

//         if (!AuthHeader) {
//             return res.status(401).json({
//                 message: "no token provided"
//             })
//         }

//         const token = AuthHeader.split(" ")[1];

//         if (!token) {
//             return res.status(401).json({  success: false, message: "Not authorized" });
//         }

//         const decoded = JWT.verify(token, JWT_ACCESS_SECRET);
//         // if (!decoded) {
//         //     return res.status(401).json({ message: "inValid token" });
//         // }
//         console.log("auth_user decoded", decoded);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ success: false, message: "Token expired" });
//         }
//         res.status(401).json({  success: false, message: "Not authorized" });
//     }
// }

const authMiddleware = async (req, res, next) => {
  try {
    // console.log("🔥 AUTH MIDDLEWARE HIT");
    const AuthHeader = req.headers.authorization;
    // console.log("AuthHeader: ", AuthHeader);

    if (!AuthHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No token Provided" });
    }

    // if (!AuthHeader || !AuthHeader.startsWith("Bearer ")) {
    //     return res.status(401).json({ message: "No token" });
    // }

    const token = AuthHeader.split(" ")[1];
    // console.log("token: ",token);
    // if (!token) {
    //     return res.status(401)
    //         .json({ success: false, message: "No authorized" })
    // }

    const decoded = JWT.verify(token, JWT_ACCESS_SECRET);
    // console.log("decoded", decoded);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "no Token",
      });
    }

    // console.log("Encoded: ", decoded);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the administrator.",
      });
    }
    // req.user = decoded;
    req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
    // console.log(req.user);
    next();
  } catch (error) {
    //  console.log("JWT ERROR:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(401).json({ success: false, message: "Not authorized" });
  }
};

module.exports = authMiddleware;
