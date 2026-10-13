
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    eventName: {
      type: String,
      required: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    foodDescription: {
      type: String,
      required: true,
      trim: true,
    },
    foodType: {
      type: String,
      enum: ["vegetarian", "non_vegetarian", "both"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    availableFrom: {
      type: Date,
      required: true,
    },
    availableUntil: {
      type: Date,
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: undefined,
        validate: {
          validator(value) {
            return (
              value === undefined ||
              (value.length === 2 &&
                value.every(Number.isFinite) &&
                value[0] >= -180 &&
                value[0] <= 180 &&
                value[1] >= -90 &&
                value[1] <= 90)
            );
          },
          message: "Location must contain valid [longitude, latitude] coordinates.",
        },
      },
    },
    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "REQUESTED",
        "ACCEPTED",
        "COLLECTED",
        "COMPLETED",
        "EXPIRED",
      ],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

donationSchema.index({ location: "2dsphere" });

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
