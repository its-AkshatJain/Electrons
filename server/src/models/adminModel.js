import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String, // Added Mobile Number
  role: { type: String, default: "admin" }
});

export default mongoose.model("Admin", adminSchema);
