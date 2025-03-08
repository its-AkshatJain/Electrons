import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

// POST /api/update-location
router.post('/update-location', async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    const { ip, latitude, longitude } = req.body;

    if (!ip || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // For simplicity, assume the user ID is sent in the request body
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { ip, latitude, longitude, updatedAt: Date.now() },
      { new: true }
    );

    console.log("Updated User Document:", user); // Log the updated user document
    return res.status(200).json({ message: "User location updated", user });
  } catch (error) {
    console.error("Error updating user location:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;