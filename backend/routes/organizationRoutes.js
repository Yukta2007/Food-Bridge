
import express from "express";
import jwt from "jsonwebtoken";
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

    if (
      !organizationName ||
      !organizationType ||
      !contactPerson ||
      !email ||
      !phone ||
      !address ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const existingOrganization = await Organization.findOne({ email });

    if (existingOrganization) {
      return res.status(400).json({
        message: "Organization with this email already exists",
      });
    }

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
      organization: {
        id: organization._id,
        organizationName: organization.organizationName,
        organizationType: organization.organizationType,
        contactPerson: organization.contactPerson,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        peopleServed: organization.peopleServed,
        foodPreferences: organization.foodPreferences,
      },
    });
  } catch (error) {
    console.error("Organization registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login organization
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

    const organization = await Organization.findOne({ email });

    if (!organization || organization.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: organization._id.toString(),
        role: "organization",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      organization: {
        id: organization._id,
        _id: organization._id,
        organizationName: organization.organizationName,
        organizationType: organization.organizationType,
        contactPerson: organization.contactPerson,
        email: organization.email,
        phone: organization.phone,
        address: organization.address,
        peopleServed: organization.peopleServed,
        foodPreferences: organization.foodPreferences,
      },
    });
  } catch (error) {
    console.error("Organization login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
