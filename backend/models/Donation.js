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
      required: true,
      enum: ["vegetarian", "non_vegetarian", "both"],
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
      },
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "REQUESTED",
        "ACCEPTED",
        "EXPIRED",
      ],
      default: "AVAILABLE",
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({
  location: "2dsphere",
});

const Donation = mongoose.model(
  "Donation",
  donationSchema
);

export default Donation;