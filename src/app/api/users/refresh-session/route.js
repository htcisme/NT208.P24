import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Update last active time
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });

    // Generate a new token with 2 minutes expiry
    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const payload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2m", // Always 2 minutes for session refreshes
    });

    return NextResponse.json({
      success: true,
      token,
      sessionTimeout: 120000, // 2 minutes in milliseconds
    });
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json(
      { success: false, message: "Error refreshing session" },
      { status: 500 }
    );
  }
}
