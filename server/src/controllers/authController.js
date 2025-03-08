import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// 🟢 Signup
export const signup = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  
  const existingUser = await User.findOne({ email }) || await Admin.findOne({ email });
  if (existingUser) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = role === "admin" 
    ? new Admin({ name, email, password: hashedPassword, role, phone }) 
    : new User({ name, email, password: hashedPassword, role, phone });

  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
};

// 🟢 Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Try to find the user in the User collection or the Admin collection
  const user = await User.findOne({ email }) || await Admin.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // Remove sensitive fields before sending the response
  user.password = undefined;

  res.json({ 
    token: generateToken(user), 
    role: user.role, 
    user  // This user object now includes _id, name, email, role, and phone
  });
};

// 🟢 Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id) || await Admin.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove sensitive information
    user.password = undefined;

    res.json({ 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      phone: user.phone 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
