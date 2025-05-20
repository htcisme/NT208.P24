import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "UserId là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy user",
        },
        { status: 404 }
      );
    }

    // Đếm số tin nhắn chưa đọc gửi đến user
    const unreadCount = await Chat.countDocuments({
      receiver: userId,
      isRead: false,
    });

    // Lấy tin nhắn cuối cùng chưa đọc
    const lastMessage = await Chat.findOne({
      receiver: userId,
      isRead: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: unreadCount,
      lastMessage,
    });
  } catch (error) {
    console.error("Error checking unread messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi kiểm tra tin nhắn chưa đọc",
      },
      { status: 500 }
    );
  }
}
