import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";

// Danh sách tin nhắn chủ động
const proactiveMessages = [
  "Chào bạn! Có hoạt động mới vừa được đăng. Bạn đã xem chưa?",
  "Thời hạn đăng ký cho sự kiện sắp kết thúc. Bạn có quan tâm không?",
  "Chào bạn, hôm nay bạn cần hỗ trợ về vấn đề gì?",
  "Đoàn khoa đang có thông báo mới. Bạn có thể kiểm tra tại trang Thông báo.",
  "Xin chào! Mình là bot hỗ trợ. Bạn cần giúp đỡ gì không?",
];

// Lấy tin nhắn ngẫu nhiên
function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * proactiveMessages.length);
  return proactiveMessages[randomIndex];
}

// API để gửi tin nhắn chủ động đến user
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, message, secretKey } = body;

    // Kiểm tra secret key để đảm bảo chỉ các dịch vụ được ủy quyền mới gọi API này
    if (secretKey !== process.env.BOT_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Không được phép",
        },
        { status: 403 }
      );
    }

    // Nếu không có userId cụ thể, gửi cho tất cả người dùng
    if (!userId) {
      // Lấy tất cả người dùng thông thường (không phải admin)
      const users = await User.find({ role: { $ne: "admin" } }).lean();
      const botId = new mongoose.Types.ObjectId();

      // Tạo tin nhắn cho mỗi người dùng
      const messages = users.map((user) => ({
        sender: botId,
        senderName: "Bot Hỗ Trợ",
        receiver: user._id.toString(),
        content: message || getRandomMessage(),
        isBot: true,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      // Lưu tất cả tin nhắn vào database
      await Chat.insertMany(messages);

      return NextResponse.json({
        success: true,
        message: `Đã gửi tin nhắn chủ động đến ${users.length} người dùng`,
      });
    }

    // Nếu có userId cụ thể, chỉ gửi cho người dùng đó
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy người dùng",
        },
        { status: 404 }
      );
    }

    // Tạo tin nhắn
    const botId = new mongoose.Types.ObjectId();
    const newMessage = new Chat({
      sender: botId,
      senderName: "Bot Hỗ Trợ",
      receiver: userId,
      content: message || getRandomMessage(),
      isBot: true,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newMessage.save();

    return NextResponse.json({
      success: true,
      message: "Đã gửi tin nhắn chủ động",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error sending proactive message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi gửi tin nhắn chủ động",
      },
      { status: 500 }
    );
  }
}
