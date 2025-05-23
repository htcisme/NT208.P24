import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chat from "@/models/Chat";
import User from "@/models/User";
import mongoose from "mongoose";
// Danh sách câu trả lời có sẵn
const botResponses = {
  greetings: [
    "Xin chào! Tôi là trợ lý ảo của Đoàn khoa, tôi có thể giúp gì cho bạn?",
    "Chào bạn! Rất vui được hỗ trợ bạn. Bạn cần giúp đỡ về vấn đề gì?",
    "Chào mừng bạn đến với hệ thống hỗ trợ của Đoàn khoa MMT&TT!",
  ],
  hoatdong: [
    "Đoàn khoa luôn tổ chức nhiều hoạt động hấp dẫn. Bạn có thể xem chi tiết tại trang Hoạt động trên website.",
    "Để xem chi tiết về các hoạt động, bạn vui lòng truy cập vào mục Hoạt động trong thanh menu.",
    "Hiện tại chúng tôi có nhiều hoạt động đang diễn ra. Bạn vui lòng xem thông tin chi tiết tại trang Hoạt động.",
  ],
  dangky: [
    "Để đăng ký tham gia hoạt động, bạn cần đăng nhập và truy cập trang chi tiết hoạt động.",
    "Quy trình đăng ký hoạt động rất đơn giản: đăng nhập, chọn hoạt động và nhấn nút đăng ký.",
    "Bạn có thể đăng ký tham gia hoạt động bằng cách vào trang chi tiết hoạt động sau khi đăng nhập.",
  ],
  taikhoan: [
    "Để quản lý tài khoản, bạn có thể truy cập vào trang Cá nhân sau khi đăng nhập.",
    "Nếu quên mật khẩu, bạn có thể sử dụng chức năng 'Quên mật khẩu' trên trang đăng nhập.",
    "Thông tin tài khoản của bạn được bảo mật và chỉ dùng cho mục đích của Đoàn khoa.",
  ],
  lienhe: [
    "Bạn có thể liên hệ trực tiếp với Ban chấp hành Đoàn khoa tại Văn phòng Đoàn khoa.",
    "Email liên hệ chính thức: mmt_doanhoi@uit.edu.vn",
    "Thông tin liên hệ chi tiết có thể xem tại mục Liên hệ trên website.",
  ],
  fallback: [
    "Xin lỗi, tôi không hiểu ý của bạn. Bạn có thể mô tả rõ hơn không?",
    "Tôi chưa được lập trình để hiểu câu hỏi này. Vui lòng liên hệ admin để được hỗ trợ.",
    "Câu hỏi của bạn hơi phức tạp với tôi. Admin sẽ sớm phản hồi bạn!",
    "Tôi đã ghi nhận câu hỏi của bạn và sẽ chuyển đến admin.",
  ],
};

// Hàm phân loại tin nhắn
function classifyMessage(message) {
  message = message.toLowerCase();

  if (message.match(/xin\s*chào|chào|hi|hello|hey/i)) {
    return "greetings";
  }

  if (message.match(/hoạt\s*động|sự\s*kiện|event|chương\s*trình/i)) {
    return "hoatdong";
  }

  if (message.match(/đăng\s*ký|tham\s*gia|register|join/i)) {
    return "dangky";
  }

  if (message.match(/tài\s*khoản|đăng\s*nhập|login|mật\s*khẩu|password/i)) {
    return "taikhoan";
  }

  if (message.match(/liên\s*hệ|hỗ\s*trợ|email|gọi|support|hotline|contact/i)) {
    return "lienhe";
  }

  return "fallback";
}

// Hàm chọn ngẫu nhiên một câu trả lời từ danh sách
function getRandomResponse(category) {
  const responses = botResponses[category] || botResponses.fallback;
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
}

// Đảm bảo rằng Bot có thể phản hồi bất kể trạng thái chat hiện tại
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, message } = body;

    if (!userId || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "userId và message là bắt buộc",
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

    // Phân loại tin nhắn và lấy phản hồi phù hợp
    const messageCategory = classifyMessage(message);
    const botResponse = getRandomResponse(messageCategory);

    // Tạo tin nhắn bot
    const botId = new mongoose.Types.ObjectId();
    const botMessage = new Chat({
      sender: botId,
      senderName: "Bot Hỗ Trợ",
      content: botResponse,
      receiver: userId,
      isBot: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await botMessage.save();

    return NextResponse.json({
      success: true,
      message: "Bot đã phản hồi",
      data: botMessage,
    });
  } catch (error) {
    console.error("Error generating bot response:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi tạo phản hồi từ bot",
      },
      { status: 500 }
    );
  }
}
