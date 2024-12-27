import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import router from "./routes/router.js";
import bodyParser from "body-parser";
import cors from "cors"; // برای استفاده از CORS
// import helmet from "helmet"; // برای استفاده از امنیت HTTP
import rateLimit from "express-rate-limit"; // برای محدود کردن تعداد درخواست‌ها
import "./guard/passport.js"; // تنظیمات Passport

const app = express();
const PORT = 5090;

// اتصال به دیتابیس
mongoose.connect("mongodb://localhost:27017/vod")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Failed to connect to MongoDB", error));

// استفاده از bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// فعال‌سازی CORS
const corsOptions = {
    origin: "http://localhost:3000", // آدرس فرانت‌اند خود را وارد کنید
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization",'Access-Control-Allow-Origin'],
};

app.use(cors(corsOptions));

app.options('*', cors());

// استفاده از helmet برای امنیت بیشتر
// app.use(helmet());

// محدود کردن درخواست‌ها برای جلوگیری از حملات DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 دقیقه
    max: 100, // حداکثر 100 درخواست در 15 دقیقه
    message: "Too many requests from this IP, please try again later",
});
app.use(limiter);

// این گزینه‌ها می‌توانند به صورت پیش‌فرض به اپلیکیشن اضافه شوند
// محافظت از MIME type
// app.use(helmet.mimeTypeSniffing());
// app.use(helmet.xssFilter());
// app.use(helmet.frameguard({ action: 'deny' }));
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "'unsafe-inline'"],
//         objectSrc: ["'none'"],
//         styleSrc: ["'self'", "'unsafe-inline'"],
//         imgSrc: ["'self'", "data:"],
//     }
// }));

// استفاده از passport برای احراز هویت
app.use(passport.initialize());

// مسیرها
app.use('/', router);

// اجرای سرور
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
