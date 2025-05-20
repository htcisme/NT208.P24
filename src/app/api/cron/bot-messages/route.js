import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Kiểm tra secret key từ headers để đảm bảo chỉ cron job mới có thể gọi API này
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json(
        {
          success: false,
          message: "Không được phép",
        },
        { status: 403 }
      );
    }

    // Gọi API gửi tin nhắn chủ động
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/bot/proactive`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secretKey: process.env.BOT_SECRET_KEY,
          message: `Xin chào! Đoàn khoa có một số thông báo mới. Bạn có thể kiểm tra trong mục Thông báo. [Tin nhắn tự động - ${new Date().toLocaleString()}]`,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: "Đã kích hoạt gửi tin nhắn tự động",
      data,
    });
  } catch (error) {
    console.error("Error triggering automated messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi kích hoạt tin nhắn tự động",
      },
      { status: 500 }
    );
  }
}
