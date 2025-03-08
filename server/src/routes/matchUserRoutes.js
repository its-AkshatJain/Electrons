import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js"; // MongoDB User Model

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_FILE = path.join(__dirname, "../../data/nit_hamirpur_map.json"); // Fix JSON path issue
const ALERT_RADIUS = 30; // meters (adjustable)

// Function to calculate distance between two GPS points
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) *
            Math.cos(φ2) *
            Math.sin(Δλ / 2) *
            Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

// **📌 API to Match Users with Camera Zones**
router.get("/match-users", async (req, res) => {
    try {
        // **✅ Load camera zones from JSON file safely**
        if (!fs.existsSync(MAP_FILE)) {
            return res.status(500).json({ error: "Map file not found!" });
        }
        const mapData = JSON.parse(fs.readFileSync(MAP_FILE, "utf8"));

        if (!mapData.cameraZones || mapData.cameraZones.length === 0) {
            return res.status(400).json({ error: "No camera zones found!" });
        }

        const cameras = mapData.cameraZones;

        // **✅ Fetch users from MongoDB**
        const users = await User.find({}, "name email ip latitude longitude");

        let alerts = [];

        users.forEach((user) => {
            cameras.forEach((camera) => {
                const distance = haversine(
                    user.latitude,
                    user.longitude,
                    camera.coordinates.latitude,
                    camera.coordinates.longitude
                );

                if (distance <= ALERT_RADIUS) {
                    alerts.push({
                        userId: user._id,
                        name: user.name,
                        email: user.email,
                        userIP: user.ip,
                        cameraId: camera.id,
                        location: {
                            latitude: user.latitude,
                            longitude: user.longitude,
                        },
                        distance: distance.toFixed(2) + "m",
                        message: "User is in a high-risk zone!",
                    });
                }
            });
        });

        res.json({ matchedUsers: alerts });
    } catch (error) {
        console.error("Error in matching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
