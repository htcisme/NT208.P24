import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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
    await dbConnect();

    const { name, email, password, role, adminCode } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Tên, email và mật khẩu là bắt buộc" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email không hợp lệ" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã được sử dụng" },
        { status: 409 }
      );
    }

    // Validate admin role with admin code
    let userRole = "user"; // Default role
    if (role === "admin") {
      // Verify admin code (store this securely in your .env)
      const validAdminCode = process.env.ADMIN_SECRET_CODE || "admin123"; // Change this in production

      if (adminCode !== validAdminCode) {
        return NextResponse.json(
          { success: false, message: "Mã xác thực Admin không hợp lệ" },
          { status: 403 }
        );
      }

      userRole = "admin";
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole, // Set the validated role
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: "Có lỗi xảy ra trong quá trình đăng ký" },
      { status: 500 }
    );
  }
}
