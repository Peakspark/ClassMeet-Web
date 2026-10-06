import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
    try {
        // Get token from HTTP-only cookie
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find current user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });
        }

        // Attach user to request
        req.user = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role
        };

        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Authentication token expired"
            });
        }

        console.error("Authentication error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export default auth;