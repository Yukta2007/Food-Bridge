import express from "express";
import mongoose from "mongoose";

import Request from "../models/Request.js";
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

router.use(authMiddleware);

/* ================= CREATE REQUEST ================= */

router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        message: "Only organizations can request food.",
      });
    }

    const { donationId } = req.body;
    const organizationId = req.user.id;

    if (!validId(donationId)) {
      return res.status(400).json({
        message: "Invalid donation ID.",
      });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found.",
      });
    }

    if (donation.status !== "AVAILABLE") {
      return res.status(400).json({
        message: "This food donation is no longer available.",
      });
    }

    const existing = await Request.findOne({
      donationId,
      organizationId,
      status: { $in: ["REQUESTED", "ACCEPTED"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already requested this donation.",
      });
    }

    const request = await Request.create({
      donationId,
      organizationId,
      organizerId: donation.organizerId,
    });

    donation.status = "REQUESTED";
    await donation.save();

    const result = await Request.findById(request._id)
      .populate(
        "organizationId",
        "organizationName organizationType contactPerson email phone address"
      )
      .populate(
        "donationId",
        "eventName eventType foodDescription foodType quantity availableFrom availableUntil pickupLocation location status"
      );

    res.status(201).json({
      message: "Food request created successfully.",
      request: result,
    });
  } catch (error) {
    console.error("CREATE REQUEST ERROR:", error);

    res.status(500).json({
      message: "Failed to create request.",
    });
  }
});

/* ================= ORGANIZER REQUESTS ================= */

router.get("/organizer/:organizerId", async (req, res) => {
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
        message: "You can only view your own requests.",
      });
    }

    const requests = await Request.find({
      organizerId: req.user.id,
    })
      .populate(
        "organizationId",
        "organizationName organizationType contactPerson email phone address"
      )
      .populate(
        "donationId",
        "eventName eventType foodDescription foodType quantity availableFrom availableUntil pickupLocation location status"
      )
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("GET ORGANIZER REQUESTS ERROR:", error);

    res.status(500).json({
      message: "Failed to load requests.",
    });
  }
});

/* ================= ORGANIZATION REQUESTS ================= */

router.get("/organization/:organizationId", async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        message: "Organization access required.",
      });
    }

    const { organizationId } = req.params;

    if (!validId(organizationId)) {
      return res.status(400).json({
        message: "Invalid organization ID.",
      });
    }

    if (req.user.id !== organizationId) {
      return res.status(403).json({
        message: "You can only view your own requests.",
      });
    }

    const requests = await Request.find({
      organizationId: req.user.id,
    })
      .populate(
        "donationId",
        "eventName eventType foodDescription foodType quantity availableFrom availableUntil pickupLocation location status"
      )
      .populate(
        "organizerId",
        "fullName email phone eventCompany"
      )
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error("GET ORGANIZATION REQUESTS ERROR:", error);

    res.status(500).json({
      message: "Failed to load requests.",
    });
  }
});

/* ================= ACCEPT ================= */

router.patch("/:requestId/accept", async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can accept requests.",
      });
    }

    const { requestId } = req.params;

    if (!validId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.organizerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot modify this request.",
      });
    }

    if (request.status !== "REQUESTED") {
      return res.status(400).json({
        message: "Only requested requests can be accepted.",
      });
    }

    request.status = "ACCEPTED";
    request.acceptedAt = new Date();

    await request.save();

    await Donation.findByIdAndUpdate(
      request.donationId,
      { status: "ACCEPTED" }
    );

    res.json({
      message: "Food request accepted.",
      request,
    });
  } catch (error) {
    console.error("ACCEPT REQUEST ERROR:", error);

    res.status(500).json({
      message: "Failed to accept request.",
    });
  }
});

/* ================= REJECT ================= */

router.patch("/:requestId/reject", async (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res.status(403).json({
        message: "Only organizers can reject requests.",
      });
    }

    const { requestId } = req.params;

    if (!validId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.organizerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot modify this request.",
      });
    }

    if (request.status !== "REQUESTED") {
      return res.status(400).json({
        message: "Only requested requests can be rejected.",
      });
    }

    request.status = "REJECTED";

    await request.save();

    await Donation.findByIdAndUpdate(
      request.donationId,
      { status: "AVAILABLE" }
    );

    res.json({
      message: "Food request rejected.",
      request,
    });
  } catch (error) {
    console.error("REJECT REQUEST ERROR:", error);

    res.status(500).json({
      message: "Failed to reject request.",
    });
  }
});

/* ================= START PICKUP ================= */

router.patch("/:requestId/start-pickup", async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        message: "Only organizations can start pickup.",
      });
    }

    const { requestId } = req.params;
    const { latitude, longitude } = req.body;

    if (!validId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!validLocation(latitude, longitude)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.organizationId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot start pickup for this request.",
      });
    }

    if (request.status !== "ACCEPTED") {
      return res.status(400).json({
        message: "Pickup can only start after acceptance.",
      });
    }

    request.pickupStartedAt = new Date();

    request.pickupLocation = {
      type: "Point",
      coordinates: [
        Number(longitude),
        Number(latitude),
      ],
    };

    request.lastLocationUpdate = new Date();

    await request.save();

    res.json({
      message: "Pickup tracking started.",
      request,
    });
  } catch (error) {
    console.error("START PICKUP ERROR:", error);

    res.status(500).json({
      message: "Failed to start pickup tracking.",
    });
  }
});

/* ================= UPDATE LOCATION ================= */

router.patch("/:requestId/location", async (req, res) => {
  try {
    if (req.user.role !== "organization") {
      return res.status(403).json({
        message: "Only organizations can update pickup location.",
      });
    }

    const { requestId } = req.params;
    const { latitude, longitude } = req.body;

    if (!validId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    if (!validLocation(latitude, longitude)) {
      return res.status(400).json({
        message: "Invalid latitude or longitude.",
      });
    }

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    if (request.organizationId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You cannot update this request.",
      });
    }

    if (
      request.status !== "ACCEPTED" ||
      !request.pickupStartedAt
    ) {
      return res.status(400).json({
        message: "Pickup tracking is not active.",
      });
    }

    request.pickupLocation = {
      type: "Point",
      coordinates: [
        Number(longitude),
        Number(latitude),
      ],
    };

    request.lastLocationUpdate = new Date();

    await request.save();

    res.json({
      message: "Pickup location updated.",
    });
  } catch (error) {
    console.error("UPDATE LOCATION ERROR:", error);

    res.status(500).json({
      message: "Failed to update pickup location.",
    });
  }
});

/* ================= TRACKING ================= */

router.get("/:requestId/tracking", async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!validId(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID.",
      });
    }

    const request = await Request.findById(requestId)
      .populate(
        "organizationId",
        "organizationName organizationType contactPerson email phone address"
      )
      .populate(
        "donationId",
        "eventName eventType foodDescription foodType quantity availableFrom availableUntil pickupLocation location status"
      )
      .populate(
        "organizerId",
        "fullName email phone eventCompany"
      );

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    const isOrganization =
      req.user.role === "organization" &&
      request.organizationId?._id.toString() === req.user.id;

    const isOrganizer =
      req.user.role === "organizer" &&
      request.organizerId?._id.toString() === req.user.id;

    if (!isOrganization && !isOrganizer) {
      return res.status(403).json({
        message:
          "You are not authorized to view this tracking data.",
      });
    }

    const coordinates =
      request.pickupLocation?.coordinates;

    res.json({
      requestId: request._id,
      status: request.status,
      pickupStartedAt: request.pickupStartedAt,

      pickupLocation: coordinates
        ? {
            latitude: coordinates[1],
            longitude: coordinates[0],
          }
        : null,

      lastLocationUpdate:
        request.lastLocationUpdate,

      organization: request.organizationId,
      donation: request.donationId,
      organizer: request.organizerId,
    });
  } catch (error) {
    console.error("TRACKING ERROR:", error);

    res.status(500).json({
      message: "Failed to load tracking information.",
    });
  }
});

export default router;