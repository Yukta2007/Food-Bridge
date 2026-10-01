import express from "express";
import Organization from "../models/Organization.js";

const router = express.Router();

// Register organization
router.post("/register", async (req, res) => {
  try {
    const {
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      address,
      peopleServed,
      foodPreferences,
      password,
    } = req.body;

    // Check if organization already exists
    const existingOrganization = await Organization.findOne({ email });

    if (existingOrganization) {
      return res.status(400).json({
        message: "Organization with this email already exists",
      });
    }

    // Create organization
    const organization = await Organization.create({
      organizationName,
      organizationType,
      contactPerson,
      email,
      phone,
      address,
      peopleServed,
      foodPreferences,
      password,
    });

    res.status(201).json({
      message: "Organization registered successfully",
      organization,
    });
  } catch (error) {
    console.error("Organization registration error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;