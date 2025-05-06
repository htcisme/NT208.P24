import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Get a single user
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Sử dụng destructuring thay vì params.id

    const user = await User.findById(id).select("-password").lean();

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
        createdAt: new Date(user.createdAt).toLocaleDateString("vi-VN"),
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin người dùng" },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Sử dụng destructuring thay vì params.id

    const { name, email, role, adminCode, password } = await request.json();

    // Find user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Validate email
    if (email) {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Email không hợp lệ" },
          { status: 400 }
        );
      }

      // Check if email is being used by another user
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email đã được sử dụng" },
          { status: 409 }
        );
      }
    }

    // Validate admin role with admin code if changing to admin
    if (role === "admin" && user.role !== "admin") {
      // Verify admin code (store this securely in your .env)
      const validAdminCode =
        process.env.ADMIN_SECRET_CODE || "XP8c!vK2#qRz7@tL9jWnE5$dYg6*pH";

      if (adminCode !== validAdminCode) {
        return NextResponse.json(
          { success: false, message: "Mã xác thực Admin không hợp lệ" },
          { status: 403 }
        );
      }
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    // If password is provided, hash and update it
    if (password && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật người dùng thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: new Date(user.createdAt).toLocaleDateString("vi-VN"),
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật người dùng" },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params; // Sử dụng destructuring thay vì params.id

    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa người dùng thành công",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa người dùng" },
      { status: 500 }
    );
  }
}
