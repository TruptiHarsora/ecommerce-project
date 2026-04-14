const User = require("../models/User.js");
const JWT = require("jsonwebtoken");
const { registerSchema } = require("../validators/user.validator");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken");
const { JWT_REFRESH_SECRET } = require("../config/config");

const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);

        //validation
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.details.map(err => ({
                    field: err.path.join("."),
                    message: err.message
                }))
            });
        }

        //check user exist
        const existUser = await User.findOne({ email: req.body.email });
        if (existUser) {
            return res.status(400).json({ message: "User alrady exist" });
        }

        //save data
        const user = await User.create(req.body);
        // console.log("register user: ", user);

        res.status(200).json({
            message: "user Register Successfully",
            user
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }


        const user = await User.findOne({ email: email });
        // console.log("auth controller user:", user);
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // console.log("ACCESS token", accessToken);
        // console.log("REFRESH token", refreshToken);
        
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true });
        // console.log("User", user);
        res.json({
            message: "Login sucessfully",
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (token) {
            const decoded = JWT.verify(token, JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.id);

            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("refreshToken");

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const refreshTokenHandler = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        const decoded = JWT.verify(token, JWT_REFRESH_SECRET);
        console.log("decoded : ", decoded);

        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({ message: "Token Expired" });
        }

        const newAccessToken = generateAccessToken(user);

        res.json({
            token: newAccessToken
        })
    } catch (error) {
        return res.status(401).json({
            message: "Token Expired"
        })
    }
}




module.exports = { register, login, logout, refreshTokenHandler }