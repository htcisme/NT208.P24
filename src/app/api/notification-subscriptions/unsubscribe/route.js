import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import NotificationSubscription from "@/models/NotificationSubscription";

export async function POST(request) {
  try {
    await dbConnect();
    console.log("=== Bắt đầu xử lý hủy đăng ký ===");

    const body = await request.json();
    const { email } = body;

    if (!email) {
      console.error("Thiếu email trong request");
      return NextResponse.json(
        { success: false, message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm và cập nhật trạng thái đăng ký
    const subscription = await NotificationSubscription.findOne({ email });

    if (!subscription) {
      console.log(`Không tìm thấy đăng ký cho email: ${email}`);
      return NextResponse.json(
        { success: false, message: "Không tìm thấy đăng ký cho email này" },
        { status: 404 }
      );
    }

    if (!subscription.isActive) {
      console.log(`Email ${email} đã được hủy đăng ký trước đó`);
      return NextResponse.json(
        { success: false, message: "Email này đã được hủy đăng ký trước đó" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái thành không hoạt động
    subscription.isActive = false;
    await subscription.save();

    console.log(`Đã hủy đăng ký thành công cho email: ${email}`);
    console.log("=== Hoàn thành xử lý hủy đăng ký ===");

    return NextResponse.json({
      success: true,
      message: "Hủy đăng ký thành công",
    });
  } catch (error) {
    console.error("=== Lỗi khi xử lý hủy đăng ký ===");
    console.error("Lỗi:", error.message);
    console.error("Stack:", error.stack);
    console.error("=========================");

    return NextResponse.json(
      { success: false, message: "Lỗi khi xử lý yêu cầu hủy đăng ký" },
      { status: 500 }
    );
  }
}
