import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/router.js";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet"; 
import rateLimit from "express-rate-limit"; 
import "./guard/passport.js"; 

const app = express();
const PORT = 5090;

// اتصال به دیتابیس
mongoose.connect("mongodb://localhost:27017/vod")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); // سرور را متوقف کنید
    });

// استفاده از bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// فعال‌سازی CORS
const corsOptions = {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// تنظیم Helmet
app.use(helmet());

// محدود کردن تعداد درخواست‌ها
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// استفاده از passport
app.use(passport.initialize());

// مسیرها
app.use('/', router);

// اجرای سرور
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
