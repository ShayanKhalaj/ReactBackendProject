import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/schema/user.js";


const secretKey = "your_jwt_secret";

// تنظیمات استراتژی JWT
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKey,
};

// استراتژی JWT برای Passport
passport.use(
    new JwtStrategy(options, async (payload, done) => {
        console.log(payload)
        try {
            const user = await User.findOne({_id:payload.id});
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    })
);

export const authenticate = passport.authenticate("jwt", { session: false });
