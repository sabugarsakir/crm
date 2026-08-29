import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // ✅ Import JWT
import dotenv from "dotenv";

dotenv.config(); // ✅ Load environment variables

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        let redirectUrl = "";

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        // Verify password using bcrypt (with legacy fallback)
        let isMatch = false;
        if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            isMatch = (password === user.password);
        }

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (user.role === "Admin") {
            redirectUrl = "/admin/dashboard";
        } else if (user.role === "Manager") {
            redirectUrl = "/manager/dashboard";
        } else if (user.role === "Agent" || user.role === "Channel Partner") {
            redirectUrl = "/agent/dashboard";
        } else {
            redirectUrl = "/agent/dashboard";
        }

        //Generate JWT token with expiry time & include role
        const token = jwt.sign({ id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        return res.status(200).json({ success: true, redirectUrl, token, role: user.role, name: user.name, id: user._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export default loginController;
