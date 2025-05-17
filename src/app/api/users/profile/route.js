import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Get user profile
export async function GET(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt).toLocaleDateString("vi-VN"),
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");
    const avatarFile = formData.get("avatar");

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Handle avatar upload
    if (avatarFile) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `avatar-${uniqueSuffix}.${avatarFile.type.split("/")[1]}`;
      const filepath = path.join(uploadDir, filename);

      // Save file
      await writeFile(filepath, buffer);
      user.avatar = `/uploads/${filename}`;
    }

    // Validate email if it's being changed
    if (email && email !== user.email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Email không hợp lệ" },
          { status: 400 }
        );
      }

      // Check if email is being used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email đã được sử dụng" },
          { status: 409 }
        );
      }
    }

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change if requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: "Mật khẩu hiện tại không đúng" },
          { status: 400 }
        );
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
          { status: 400 }
        );
      }

      // Hash and update new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt).toLocaleDateString("vi-VN"),
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật thông tin người dùng" },
      { status: 500 }
    );
  }
} 