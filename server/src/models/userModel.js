import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String, // Added Mobile Number
  role: { type: String, default: "user" }
});

export default mongoose.model("User", userSchema);
