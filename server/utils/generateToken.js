const JWT = require("jsonwebtoken");
const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET,
} = require("../config/config");

const generateAccessToken = (user) => {
  // console.log("token user: ", user);
  return JWT.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: JWT_ACCESS_EXPIRES || "15m",
    },
  );
};
const generateRefreshToken = (user) => {
  // console.log("token user: ", user);
  return JWT.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES || "7d",
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
