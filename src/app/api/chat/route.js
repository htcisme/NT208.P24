import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";

// GET - Lấy tin nhắn
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const excludeBot = searchParams.get("excludeBot") === "true";

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

    let query = {};

    if (user.role === "admin") {
      if (excludeBot) {
        // Admin xem tin nhắn - loại bỏ bot
        query = {
          $and: [
            {
              $or: [
                { sender: new mongoose.Types.ObjectId(userId) },
                { receiver: userId },
              ],
            },
            { isBot: false },
            { receiver: { $ne: "bot" } },
          ],
        };
      } else {
        // Admin xem tất cả tin nhắn
        query = {};
      }
    } else {
      // User thường xem tin nhắn của mình
      query = {
        $or: [{ sender: userId }, { receiver: userId }],
      };
    }

    // Lấy tin nhắn và sắp xếp theo thời gian tạo
    const messages = await Chat.find(query).sort({ createdAt: 1 }).lean();

    // Thêm trường isUser cho mỗi tin nhắn
    const formattedMessages = messages.map((msg) => ({
      ...msg,
      isUser: msg.sender.toString() === userId && !msg.isBot,
    }));

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
    });
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy tin nhắn",
      },
      { status: 500 }
    );
  }
}

// POST - Gửi tin nhắn mới
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, content, userName, chatMode = "auto" } = body;

    if (!userId || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "userId và content là bắt buộc",
        },
        { status: 400 }
      );
    }

    // Kiểm tra user có tồn tại không
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

    // Xác định receiver dựa vào chatMode
    let receiver = "admin"; // Mặc định gửi cho admin

    // Nếu người dùng chọn chat với bot, đặt receiver là 'bot'
    if (chatMode === "bot") {
      receiver = "bot";
    }

    // Tạo tin nhắn mới
    const newMessage = new Chat({
      sender: userId,
      senderName: userName || user.name,
      content,
      receiver, // Sử dụng receiver đã xác định
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: "Gửi tin nhắn thành công",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi gửi tin nhắn",
      },
      { status: 500 }
    );
  }
}
