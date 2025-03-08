import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  mobile: String,
  role: { type: String, default: "user" },
  ip: String,           // Field for current IP
  latitude: Number,     // Field for current latitude
  longitude: Number,    // Field for current longitude
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
