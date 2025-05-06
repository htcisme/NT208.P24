import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

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
    let userRole = "user";
    if (role === "admin") {
      // Verify admin code (store this securely in your .env)
      const validAdminCode =
        process.env.ADMIN_SECRET_CODE || "XP8c!vK2#qRz7@tL9jWnE5$dYg6*pH";

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
      role: userRole,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "Thêm người dùng thành công",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: new Date(newUser.createdAt).toLocaleDateString("vi-VN"),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi thêm người dùng" },
      { status: 500 }
    );
  }
}
