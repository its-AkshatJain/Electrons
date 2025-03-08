// backend/src/server.js (or your main server file)
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import connectDB from "./config/database.js";
import "./config/passport.js"; // Import Passport configuration
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";  // New location routes
import matchUserRoutes from "./routes/matchUserRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api", locationRoutes);  // The update-location endpoint is now available at /api/update-location
app.use("/api", matchUserRoutes);  // ✅ Add match-user routes

// **📌 WebSocket for Real-time Alerts**
// io.on("connection", (socket) => {
//   console.log("New client connected");

//   socket.on("requestAlerts", async () => {
//       try {
//           const response = await fetch("http://localhost:5000/api/match-users");
//           const data = await response.json();
//           socket.emit("alerts", data);
//       } catch (error) {
//           console.error("Error fetching alerts:", error);
//       }
//   });

//   socket.on("disconnect", () => {
//       console.log("Client disconnected");
//   });
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));