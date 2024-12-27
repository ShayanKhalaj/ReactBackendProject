import jwt from "jsonwebtoken";
import User from "../models/schema/user.js";

const secretKey = "your_jwt_secret";

class AuthController {
    async register(req, res) {
        const { firstName, lastName, mobile, email, password } = req.body;
        console.log(req.body)
        try {
            const existingUser = await User.findOne({ mobile });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" });
            }

            const user = new User({ firstName, lastName, mobile, email, password });
            await user.save();

            return res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Registration failed", error });
        }
    }

    async login(req, res) {
        const { mobile, password, rememberMe } = req.body;
        try {
            const user = await User.findOne({ mobile });
            if (!user) return res.status(404).json({ message: "User not found" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

            const expiresIn = rememberMe ? "7d" : "1d";
            const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn });

            return res.status(200).json({ message: "Login successful", token });
        } catch (error) {
            return res.status(500).json({ message: "Login failed", error });
        }
    }

    async getUserProfile(req, res) {
        const user = req.user; // Passport JWT کاربر را در `req.user` قرار می‌دهد
        return res.status(200).json({ message: "User profile fetched", user });
    }
}

export default AuthController;
