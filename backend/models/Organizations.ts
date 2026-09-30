import mongoose, { Schema, Document } from "mongoose";

export interface IOrganization extends Document {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  peopleServed?: number | null;
  foodPreferences: string[];
  password: string;
  createdAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    organizationType: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
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

    address: {
      type: String,
      required: true,
      trim: true,
    },

    peopleServed: {
      type: Number,
      default: null,
    },

    foodPreferences: {
      type: [String],
      default: [],
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

const Organization =
  mongoose.models.Organization ||
  mongoose.model<IOrganization>("Organization", OrganizationSchema);

export default Organization;