import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

// POST - Xóa tất cả thông báo đã đọc của người dùng
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // Lấy userId từ body
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Thiếu userId trong body" },
        { status: 400 }
      );
    }

    // Xóa tất cả thông báo đã đọc
    await Notification.deleteMany({
      userId,
      type: "notification",
      read: true,
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa tất cả thông báo đã đọc",
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa thông báo" },
      { status: 500 }
    );
  }
}
