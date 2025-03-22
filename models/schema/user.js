import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    username:{type:String,require:true},
    role: { type: String, enum: ["user", "admin"], default: "user" }, // نقش کاربر
}, { timestamps: true });

// هش کردن رمز عبور قبل از ذخیره
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// متد برای مقایسه رمز عبور ورودی با رمز عبور هش شده
export const comparePassword = UserSchema.methods.comparePassword = async function (password) {
    const compare =  await bcrypt.compare(password, this.password);
    console.log(compare)
    return compare
};

const User = mongoose.model("users", UserSchema);
export default User;
