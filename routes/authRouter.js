import express from "express";
import AuthController from "../controllers/authController.js";
import { authenticate } from "../guard/passport.js";

const authRouter = express.Router();
const authController = new AuthController();

// ثبت‌نام
authRouter.post("/register", authController.register);

// ورود
authRouter.post("/login", authController.login);

// پروفایل کاربر
authRouter.get("/profile", authenticate, authController.getUserProfile);

// مسیر مخصوص مدیر
authRouter.get("/admin", authenticate, (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    res.status(200).json({ message: "Welcome Admin" });
});

export default authRouter;
