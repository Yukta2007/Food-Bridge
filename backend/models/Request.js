import mongoose from "mongoose";

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
      ],
      default: "REQUESTED",
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
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },

    lastLocationUpdate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

requestSchema.index(
  { pickupLocation: "2dsphere" },
  { sparse: true }
);

export default mongoose.model("Request", requestSchema);