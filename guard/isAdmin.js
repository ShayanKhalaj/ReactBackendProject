export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }
    next(); // به درخواست ادامه می‌دهیم
};
