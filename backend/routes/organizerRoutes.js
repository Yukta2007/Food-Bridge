import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Organizer from "../models/Organizer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      eventCompany,
      password,
    } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const existingOrganizer = await Organizer.findOne({
      email: email.toLowerCase(),
    });

    if (existingOrganizer) {
      return res.status(400).json({
        message: "Organizer with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organizer = await Organizer.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      eventCompany,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Organizer registered successfully",
      organizer: {
        id: organizer._id,
        fullName: organizer.fullName,
        email: organizer.email,
      },
    });
  } catch (error) {
    console.error("Organizer registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const organizer = await Organizer.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!organizer) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      organizer.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: organizer._id,
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
        fullName: organizer.fullName,
        email: organizer.email,
      },
    });
  } catch (error) {
    console.error("Organizer login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;