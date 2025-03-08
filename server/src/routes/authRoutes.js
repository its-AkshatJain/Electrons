import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { signup, login, getUserProfile } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";

dotenv.config();
const router = express.Router();

// Signup & Login endpoints
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", authenticateUser, getUserProfile);

// Google OAuth endpoints
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    console.log("Google Callback - req.user:", req.user);

    if (!req.user) {
      console.error("OAuth Failed: No user returned by passport.");
      return res.redirect("http://localhost:5173/login?error=OAuthFailed");
    }

    // Look up the user in the Admin collection first
    let user = await Admin.findOne({ email: req.user.email });
    if (!user) {
      // Then check in the User collection
      user = await User.findOne({ email: req.user.email });
    }

    if (!user) {
      console.log("User not found in database, creating new user with role 'user'");
      // Create a new user with default role "user"
      user = new User({
        name: req.user.displayName,
        email: req.user.emails && req.user.emails[0].value,
        googleId: req.user.id,
        role: "user",
      });
      try {
        await user.save();
        console.log("New user created:", user);
      } catch (error) {
        console.error("Error creating user:", error);
        return res.redirect("http://localhost:5173/login?error=UserCreationFailed");
      }
    } else {
      console.log("Existing user found:", user);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Include userId in the redirect URL query parameters
    if (user.role === "admin") {
      res.redirect(`http://localhost:5173/admin-dashboard?token=${token}&role=${user.role}&userId=${user._id}`);
    } else {
      res.redirect(`http://localhost:5173/user-dashboard?token=${token}&role=${user.role}&userId=${user._id}`);
    }
  }
);

export default router;
