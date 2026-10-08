import express from "express";
import mongoose from "mongoose";
import Donation from "../models/Donation.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const validId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const validLocation = (latitude, longitude) => {
  const lat = Number(latitude);
  const lng = Number(longitude);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// All donation APIs require login
router.use(authMiddleware);

/* ================= CREATE DONATION ================= */

router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can post food.",
      });
    }

    const {
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

    if (
      !eventName ||
      !eventType ||
      !foodDescription ||
      !foodType ||
      !quantity ||
      !availableFrom ||
      !availableUntil ||
      !pickupLocation
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0.",
      });
    }

    if (
      new Date(availableFrom) >=
      new Date(availableUntil)
    ) {
      return res.status(400).json({
        message: "Available until must be after available from.",
      });
    }

    let location;

    if (
      latitude !== undefined &&
      longitude !== undefined &&
      latitude !== "" &&
      longitude !== ""
    ) {
      if (!validLocation(latitude, longitude)) {
        return res.status(400).json({
          message: "Invalid latitude or longitude.",
        });
      }

      location = {
        type: "Point",
        coordinates: [
          Number(longitude),
          Number(latitude),
        ],
      };
    }

    const donation = await Donation.create({
      organizerId: req.user.id,
      eventName,
      eventType,
      foodDescription,
      foodType,
      quantity: Number(quantity),
      availableFrom,
      availableUntil,
      pickupLocation,
      ...(location && { location }),
    });

    res.status(201).json({
      message: "Food donation posted successfully.",
      donation,
    });
  } catch (error) {
    console.error("CREATE DONATION ERROR:", error);

    res.status(500).json({
      message: "Failed to create donation.",
    });
  }
});

/* ================= ALL AVAILABLE DONATIONS ================= */

router.get("/", async (req, res) => {
  try {
    const donations = await Donation.find({
      status: "AVAILABLE",
    })
      .populate(
        "organizerId",
        "fullName email phone"
      )
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error("GET DONATIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch donations.",
    });
  }
});

/* ================= NEARBY DONATIONS ================= */

router.get("/nearby", async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        message: "Only organizations can search nearby food.",
      });
    }

    const {
      latitude,
      longitude,
      radius = 10000,
    } = req.query;

    if (!validLocation(latitude, longitude)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude.",
      });
    }

    const maxDistance = Number(radius);

    if (
      !Number.isFinite(maxDistance) ||
      maxDistance <= 0
    ) {
      return res.status(400).json({
        message: "Invalid search radius.",
      });
    }

    const donations = await Donation.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              Number(longitude),
              Number(latitude),
            ],
          },
          key: "location",
          distanceField: "distance",
          maxDistance,
          spherical: true,
          query: {
            status: "AVAILABLE",
          },
        },
      },
      {
        $lookup: {
          from: "organizers",
          localField: "organizerId",
          foreignField: "_id",
          as: "organizer",
        },
      },
      {
        $unwind: {
          path: "$organizer",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          eventName: 1,
          eventType: 1,
          foodDescription: 1,
          foodType: 1,
          quantity: 1,
          availableFrom: 1,
          availableUntil: 1,
          pickupLocation: 1,
          status: 1,
          location: 1,
          createdAt: 1,
          distance: 1,
          organizerId: 1,
          organizer: {
            fullName: "$organizer.fullName",
            email: "$organizer.email",
            phone: "$organizer.phone",
          },
        },
      },
    ]);

    res.json(
      donations.map((donation) => ({
        ...donation,
        distanceKm: Number(
          (donation.distance / 1000).toFixed(2)
        ),
      }))
    );
  } catch (error) {
    console.error(
      "GET NEARBY DONATIONS ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to find nearby donations.",
    });
  }
});

/* ================= ORGANIZER DONATIONS ================= */

router.get(
  "/organizer/:organizerId",
  async (req, res) => {
    try {
      if (req.user.role !== "organizer") {
        return res.status(403).json({
          message: "Organizer access required.",
        });
      }

      const { organizerId } = req.params;

      if (!validId(organizerId)) {
        return res.status(400).json({
          message: "Invalid organizer ID.",
        });
      }

      if (req.user.id !== organizerId) {
        return res.status(403).json({
          message: "You can only view your own donations.",
        });
      }

      const donations = await Donation.find({
        organizerId: req.user.id,
      }).sort({ createdAt: -1 });

      res.json(donations);
    } catch (error) {
      console.error(
        "GET ORGANIZER DONATIONS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to fetch organizer donations.",
      });
    }
  }
);

export default router;