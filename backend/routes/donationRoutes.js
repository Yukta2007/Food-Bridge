
import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// Create a new food donation
router.post("/", async (req, res) => {
  try {
    const {
      organizerId,
      eventName,
      eventType,
      foodDescription,
      foodType,
      quantity,
      availableFrom,
      availableUntil,
      pickupLocation,
      latitude,
      longitude,
    } = req.body;

    console.log("Donation request body:", req.body);

    const requiredFields = {
      organizerId,
      eventName,
      eventType,
      foodDescription,
      foodType,
      quantity,
      availableFrom,
      availableUntil,
      pickupLocation,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(
        ([, value]) =>
          value === undefined ||
          value === null ||
          String(value).trim() === ""
      )
      .map(([key]) => key);

    if (missingFields.length) {
      return res.status(400).json({
        message: "Required fields are missing.",
        missingFields,
      });
    }

    if (!["vegetarian", "non_vegetarian", "both"].includes(foodType)) {
      return res.status(400).json({
        message: "Invalid food type.",
        allowedValues: ["vegetarian", "non_vegetarian", "both"],
      });
    }

    const lat = latitude == null ? null : Number(latitude);
    const lng = longitude == null ? null : Number(longitude);

    if (
      (latitude != null || longitude != null) &&
      (
        latitude == null ||
        longitude == null ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      )
    ) {
      return res.status(400).json({
        message: "Invalid latitude or longitude.",
      });
    }

    const donationData = {
      organizerId,
      eventName,
      eventType,
      foodDescription,
      foodType,
      quantity: Number(quantity),
      availableFrom,
      availableUntil,
      pickupLocation,
    };

    if (latitude != null && longitude != null) {
      donationData.location = {
        type: "Point",
        coordinates: [lng, lat],
      };
    }

    const donation = await Donation.create(donationData);

    return res.status(201).json({
      message: "Food donation posted successfully.",
      donation,
    });
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);

    return res.status(400).json({
      message: error.message || "Failed to create donation.",
    });
  }
});

// Get nearby donations
router.get("/nearby", async (req, res) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);
    const radius = Number(req.query.radius ?? 10000);

    if (
      req.query.latitude === undefined ||
      req.query.longitude === undefined ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: "Valid latitude and longitude are required.",
      });
    }

    if (!Number.isFinite(radius) || radius <= 0 || radius > 100000) {
      return res.status(400).json({
        message: "Radius must be between 1 and 100000 metres.",
      });
    }

    const donations = await Donation.find({
      status: "AVAILABLE",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius,
        },
      },
      availableUntil: { $gte: new Date() },
    })
      .populate("organizerId", "fullName email phone")
      .lean();

    const results = donations.map((donation) => {
      const [lng, lat] = donation.location.coordinates;
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const dLat = toRadians(lat - latitude);
      const dLng = toRadians(lng - longitude);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(latitude)) *
          Math.cos(toRadians(lat)) *
          Math.sin(dLng / 2) ** 2;

      const distanceKm =
        6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return {
        ...donation,
        distanceKm: Number(distanceKm.toFixed(2)),
      };
    });

    return res.json(results);
  } catch (error) {
    console.error("GET NEARBY DONATIONS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch nearby donations.",
    });
  }
});

// Get all available donations
router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find({ status: "AVAILABLE" })
      .populate("organizerId", "fullName email phone")
      .sort({ createdAt: -1 });

    return res.json(donations);
  } catch (error) {
    console.error("GET DONATIONS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch donations.",
    });
  }
});

// Get donations by organizer
router.get("/organizer/:organizerId", async (req, res) => {
  try {
    const donations = await Donation.find({
      organizerId: req.params.organizerId,
    }).sort({ createdAt: -1 });

    return res.json(donations);
  } catch (error) {
    console.error("GET ORGANIZER DONATIONS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch organizer donations.",
    });
  }
});

export default router;
