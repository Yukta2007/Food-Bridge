import mongoose, { Schema, Document } from "mongoose";

export interface IOrganizer extends Document {
  fullName: string;
  email: string;
  phone: string;
  eventCompany?: string | null;
  password: string;
  createdAt: Date;
}

const OrganizerSchema = new Schema<IOrganizer>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    eventCompany: {
      type: String,
      default: null,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organizer =
  mongoose.models.Organizer ||
  mongoose.model<IOrganizer>("Organizer", OrganizerSchema);

export default Organizer;