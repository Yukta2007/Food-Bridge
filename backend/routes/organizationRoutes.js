import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Organization from "../models/Organization.js";

const router = express.Router();

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
        message: "Please fill all required fields",
      });
    }

    const existingOrganization = await Organization.findOne({
      email: email.toLowerCase(),
    });

    if (existingOrganization) {
      return res.status(400).json({
        message: "Organization with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await Organization.create({
      organizationName,
      organizationType,
      contactPerson,
      email: email.toLowerCase(),
      phone,
      address,
      peopleServed,
      foodPreferences,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Organization registered successfully",
      organization: {
        id: organization._id,
        organizationName: organization.organizationName,
        email: organization.email,
      },
    });
  } catch (error) {
    console.error("Organization registration error:", error);

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

    const organization = await Organization.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!organization) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      organization.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: organization._id,
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
        organizationName: organization.organizationName,
        email: organization.email,
      },
    });
  } catch (error) {
    console.error("Organization login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

export default router;