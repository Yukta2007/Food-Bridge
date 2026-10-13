import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/backend/db.config";
import Organizer from "@/backend/models/Organizer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      eventCompany,
      password,
    } = body;

    if (!fullName || !email || !phone || !password) {
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

    const existingOrganizer = await Organizer.findOne({
      email: email.toLowerCase(),
    });

    if (existingOrganizer) {
      return NextResponse.json(
        {
          message: "An organizer with this email already exists.",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const organizer = await Organizer.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      eventCompany: eventCompany || null,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "Organizer registered successfully.",
        organizerId: organizer._id,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("ORGANIZER API ERROR:", error);

    return NextResponse.json(
      {
        message: "Server error. Could not register organizer.",
      },
      {
        status: 500,
      }
    );
  }
}