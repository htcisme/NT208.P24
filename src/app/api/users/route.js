import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Get all users
export async function GET() {
  try {
    // Connect to database
    await dbConnect();

    // Optional: Add authentication check here
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    // }

    // Get all users, exclude password field
    const users = await User.find({}).select("-password").lean();

    // Map MongoDB _id to id for frontend compatibility
    const formattedUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: new Date(user.createdAt).toLocaleDateString("vi-VN"),
    }));

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}
