import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/backend/db.config";
import Organization from "@/backend/models/Organizations";

export async function GET() {
  try {
    await connectDB();

    return NextResponse.json({
      success: true,
      message: "MongoDB connection is working",
    });
  } catch (error) {
    console.error("MONGODB TEST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log("POST /api/organization");

    await connectDB();

    console.log("MongoDB connected");

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
          success: false,
          message: "Please fill in all required fields.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingOrganization =
      await Organization.findOne({
        email: normalizedEmail,
      });

    if (existingOrganization) {
      return NextResponse.json(
        {
          success: false,
          message: "An organization with this email already exists.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const organization = await Organization.create({
      organizationName: organizationName.trim(),
      organizationType: organizationType.trim(),
      contactPerson: contactPerson.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      address: address.trim(),
      peopleServed:
        peopleServed !== null &&
        peopleServed !== undefined &&
        peopleServed !== ""
          ? Number(peopleServed)
          : null,
      foodPreferences: Array.isArray(foodPreferences)
        ? foodPreferences
        : [],
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Organization registered successfully.",
        organizationId: organization._id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("========== BACKEND ERROR ==========");
    console.error(error);
    console.error("===================================");

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}