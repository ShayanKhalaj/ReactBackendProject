import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/schema/user.js";

const secretKey = "SECRET_KEY";

class AuthController {
  // ثبت‌نام کاربر
  async register(req, res) {
    const { firstName, lastName, mobile, email, password, username } = req.body;
    try {
      const existingUser = await User.findOne({ $or: [{ mobile }, { username }] });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "کاربری با این موبایل یا نام کاربری وجود دارد" });
      }

      // هش کردن رمز عبور
      const hashedPassword = await bcrypt.hash(password, 10);

      // ایجاد و ذخیره کاربر
      const user = new User({
        username,
        firstName,
        lastName,
        mobile,
        email,
        password: hashedPassword, // ذخیره رمز عبور هش‌شده
      });
      await user.save();

      return res
        .status(201)
        .json({ message: "ثبت‌نام با موفقیت انجام شد", user });
    } catch (error) {
      console.error("Register Error:", error);
      return res
        .status(500)
        .json({ message: "ثبت‌نام ناموفق بود، مشکل داخلی سرور رخ داد" });
    }
  }

  // ورود کاربر
  async login(req, res) {
    const { username, password, rememberMe } = req.body;
    try {
      const user = await User.findOne({ username: username });
      if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

      // مقایسه رمز عبور
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "رمز عبور اشتباه است" });
      }

      // تولید توکن JWT
      const expiresIn = rememberMe ? "7d" : "1d";
      const token = jwt.sign(
        { id: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role },
        secretKey,
        { expiresIn }
      );

      return res.status(200).json({
        message: "ورود موفقیت‌آمیز بود",
        token,
        role: user.role,
      });
    } catch (error) {
      console.error("Login Error:", error);
      return res
        .status(500)
        .json({ message: "ورود ناموفق بود، مشکل داخلی سرور رخ داد" });
    }
  }

  // دریافت اطلاعات پروفایل کاربر
  async getUserProfile(req, res) {
    try {
      const user = req.user; // فرض: JWT در Middleware بررسی شده
      if (!user) return res.status(404).json({ message: "کاربر پیدا نشد" });

      return res
        .status(200)
        .json({ message: "اطلاعات پروفایل دریافت شد", user });
    } catch (error) {
      console.error("Profile Error:", error);
      return res
        .status(500)
        .json({ message: "دریافت پروفایل ناموفق بود، مشکل داخلی سرور رخ داد" });
    }
  }
}

export default AuthController;
