import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

// Define User schema if you haven't created a User model yet
let User;
try {
  User = mongoose.model("User");
} catch {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    createdAt: { type: Date, default: Date.now },
  });

  User = mongoose.model("User", userSchema);
}

export async function POST(request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email }).lean();

    // Check if the user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Thông tin đăng nhập không hợp lệ" },
        { status: 401 }
      );
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If password is invalid
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Thông tin đăng nhập không hợp lệ" },
        { status: 401 }
      );
    }

    // Create JWT payload - don't include sensitive information
    const payload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "user",
    };

    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Return success response with token and user data
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra trong quá trình đăng nhập" },
      { status: 500 }
    );
  }
}
