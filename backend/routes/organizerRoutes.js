import express from "express";
import Organizer from "../models/Organizer.js";

const router = express.Router();

// Register organizer
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      eventCompany,
      password,
    } = req.body;

    // Check if organizer already exists
    const existingOrganizer = await Organizer.findOne({ email });

    if (existingOrganizer) {
      return res.status(400).json({
        message: "Organizer with this email already exists",
      });
    }

    // Create organizer
    const organizer = await Organizer.create({
      fullName,
      email,
      phone,
      eventCompany,
      password,
    });

    res.status(201).json({
      message: "Organizer registered successfully",
      organizer,
    });
  } catch (error) {
    console.error("Organizer registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;