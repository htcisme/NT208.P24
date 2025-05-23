import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

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

// Helper function to validate base64 image
function isValidBase64Image(base64String) {
  try {
    // Kiểm tra format base64 image
    const base64Regex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
    return base64Regex.test(base64String);
  } catch (error) {
    console.error("Error validating base64 format:", error);
    return false;
  }
}

// Helper function to get base64 image size
function getBase64ImageSize(base64String) {
  try {
    // Tính kích thước file từ base64 string
    const base64Data = base64String.split(",")[1];
    if (!base64Data) return 0;

    const padding = (base64Data.match(/=/g) || []).length;
    const bytes = (base64Data.length * 3) / 4 - padding;
    return bytes;
  } catch (error) {
    console.error("Error calculating base64 size:", error);
    return 0;
  }
}

// Update user profile
export async function PUT(request) {
  console.log("=== Starting profile update ===");

  try {
    await dbConnect();
    console.log("Database connected successfully");

    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Missing or invalid authorization header");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded?.id) {
      console.log("Invalid token or missing user ID");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("User ID from token:", decoded.id);

    // Parse JSON body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed successfully");
      console.log("Body keys:", Object.keys(body));

      // Log avatar info without showing the full base64
      if (body.avatar) {
        console.log("Avatar received:", body.avatar.substring(0, 50) + "...");
        console.log("Avatar size:", getBase64ImageSize(body.avatar), "bytes");
      }
    } catch (parseError) {
      console.error("Error parsing JSON body:", parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON data" },
        { status: 400 }
      );
    }

    const { name, email, currentPassword, newPassword, avatar } = body;

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found in database");
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    console.log("User found:", user.email);

    // Handle avatar upload (base64)
    if (avatar && avatar !== user.avatar) {
      console.log("Processing avatar update...");

      // Validate base64 image format
      if (!isValidBase64Image(avatar)) {
        console.log("Invalid base64 image format");
        return NextResponse.json(
          { success: false, message: "Định dạng ảnh không hợp lệ" },
          { status: 400 }
        );
      }

      // Check image size (max 5MB)
      const imageSize = getBase64ImageSize(avatar);
      console.log("Image size:", imageSize, "bytes");

      if (imageSize > 5 * 1024 * 1024) {
        console.log("Image too large:", imageSize);
        return NextResponse.json(
          { success: false, message: "Kích thước ảnh không được vượt quá 5MB" },
          { status: 400 }
        );
      }

      console.log("Avatar validation passed, updating...");
      user.avatar = avatar;
    }

    // Validate email if it's being changed
    if (email && email !== user.email) {
      console.log("Updating email from", user.email, "to", email);

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Email không hợp lệ" },
          { status: 400 }
        );
      }

      // Check if email is being used by another user
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email đã được sử dụng" },
          { status: 409 }
        );
      }
    }

    // Update basic info
    if (name) {
      console.log("Updating name:", name);
      user.name = name;
    }
    if (email) {
      console.log("Updating email:", email);
      user.email = email;
    }

    // Handle password change if requested
    if (currentPassword && newPassword) {
      console.log("Processing password change...");

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        console.log("Current password is incorrect");
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
      console.log("Password updated successfully");
    }

    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully");

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
    console.error("=== Error updating user profile ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi cập nhật thông tin người dùng",
        debug:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
