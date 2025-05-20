import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { adminId, userId } = body;

    if (!adminId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: "adminId và userId là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra admin có tồn tại và có quyền admin không
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Bạn không có quyền thực hiện thao tác này",
        },
        { status: 403 }
      );
    }

    // Đánh dấu tất cả tin nhắn từ user là đã đọc (trừ tin nhắn bot)
    await Chat.updateMany(
      {
        sender: userId,
        receiver: "admin",
        isBot: false, // Không đánh dấu tin nhắn bot
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Đánh dấu tin nhắn là đã đọc thành công",
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi đánh dấu tin nhắn đã đọc",
      },
      { status: 500 }
    );
  }
}
