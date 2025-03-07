import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("GoogleStrategy profile:", profile);
      try {
        // Check if the user exists in the Admin collection
        let user = await Admin.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }
        // Check if the user exists in the User collection
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        }
        // If not found, create a new user with default role "user"
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          role: "user", // Default role for new Google logins
        });
        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  let user = await Admin.findById(id);
  if (!user) {
    user = await User.findById(id);
  }
  done(null, user);
});

export default passport;
