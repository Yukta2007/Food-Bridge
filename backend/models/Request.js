
import mongoose from "mongoose";

const pickupLocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator(value) {
          return (
            Array.isArray(value) &&
            value.length === 2 &&
            Number.isFinite(value[0]) &&
            Number.isFinite(value[1]) &&
            value[0] >= -180 &&
            value[0] <= 180 &&
            value[1] >= -90 &&
            value[1] <= 90
          );
        },
        message: "Invalid GeoJSON coordinates.",
      },
    },
  },
  { _id: false }
);

const requestSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "REQUESTED",
        "ACCEPTED",
        "REJECTED",
        "PICKUP_STARTED",
        "COLLECTED",
        "COMPLETED",
      ],
      default: "REQUESTED",
      index: true,
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    pickupStartedAt: {
      type: Date,
      default: null,
    },

    pickupLocation: {
      type: pickupLocationSchema,
      default: undefined,
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
    },

    collectedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
