import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/backend/db.config";
import Organization from "@/backend/models/Organization";

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
    } = body;

    if (
      !organizationName ||
      !organizationType ||
      !contactPerson ||
      !email ||
      !phone ||
      !address ||
      !password
    ) {
      return NextResponse.json(
        {
          message: "Please provide all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const existingOrganization = await Organization.findOne({
      email: email.toLowerCase(),
    });

    if (existingOrganization) {
      return NextResponse.json(
        {
          message: "An organization with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organization = await Organization.create({
      organizationName,
      organizationType,
      contactPerson,
      email: email.toLowerCase(),
      phone,
      address,
      peopleServed:
        peopleServed !== null && peopleServed !== undefined
          ? Number(peopleServed)
          : null,
      foodPreferences: Array.isArray(foodPreferences)
        ? foodPreferences
        : [],
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Organization registered successfully.",
        organizationId: organization._id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ORGANIZATION API ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error. Could not register organization.",
      },
      {
        status: 500,
      }
    );
  }
}