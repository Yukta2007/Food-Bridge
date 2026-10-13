
import express from "express";
import jwt from "jsonwebtoken";
import Organizer from "../models/Organizer.js";

const router = express.Router();

// Register organizer
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phone, eventCompany, password } = req.body;

    if (!fullName || !email || !phone || !eventCompany || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingOrganizer = await Organizer.findOne({ email });

    if (existingOrganizer) {
      return res.status(400).json({
        message: "Organizer with this email already exists",
      });
    }

    const organizer = await Organizer.create({
      fullName,
      email,
      phone,
      eventCompany,
      password,
    });

    res.status(201).json({
      message: "Organizer registered successfully",
      organizer: {
        id: organizer._id,
        fullName: organizer.fullName,
        email: organizer.email,
        phone: organizer.phone,
        eventCompany: organizer.eventCompany,
      },
    });
  } catch (error) {
    console.error("Organizer registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login organizer
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing.");
      return res.status(500).json({
        message: "Server authentication is not configured.",
      });
    }

    const organizer = await Organizer.findOne({ email });

    if (!organizer || organizer.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: organizer._id.toString(),
        role: "organizer",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      organizer: {
        id: organizer._id,
        _id: organizer._id,
        fullName: organizer.fullName,
        email: organizer.email,
        phone: organizer.phone,
        eventCompany: organizer.eventCompany,
      },
    });
  } catch (error) {
    console.error("Organizer login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
