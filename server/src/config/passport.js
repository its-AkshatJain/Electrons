// backend/src/config/passport.js
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import User from "../models/userModel.js";  // Make sure to include .js extension
import Admin from "../models/adminModel.js";

dotenv.config();

const opts = {};
// Extract the JWT from the Authorization header as Bearer token
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;  // Ensure you have JWT_SECRET in your .env

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      // Try to find the user in the Admin collection first
      let user = await Admin.findById(jwt_payload.id);
      if (!user) {
        // Then try in the User collection
        user = await User.findById(jwt_payload.id);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      console.error("Error in JWT strategy:", error);
      return done(error, false);
    }
  })
);

// Existing Google strategy can remain below this or in a separate file if you prefer.
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
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
